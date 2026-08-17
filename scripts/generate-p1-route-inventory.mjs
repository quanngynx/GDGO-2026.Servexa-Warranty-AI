import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(repoRoot, "apps/server/src");
const policyPath = path.join(repoRoot, "documents/production-readiness/p1-route-policy-rules.json");
const outputPath = path.join(repoRoot, "documents/production-readiness/p1-route-security-inventory.json");
const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete"]);

const normalize = (value) => value.replaceAll("\\", "/");
const joinUrl = (...parts) => `/${parts.join("/").split("/").filter(Boolean).join("/")}`.replace(/\/$/, "") || "/";
const sourceKey = (absolute) => normalize(path.relative(repoRoot, absolute));

function staticPath(node) {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    let value = node.head.text;
    for (const span of node.templateSpans) {
      const expression = span.expression.getText();
      value += expression === "VERSION_API.V1" ? "v1" : `{${expression}}`;
      value += span.literal.text;
    }
    return value;
  }
  return null;
}

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return null;
  const base = specifier.startsWith("@/")
    ? path.resolve(sourceRoot, specifier.slice(2))
    : path.resolve(path.dirname(fromFile), specifier);
  for (const candidate of [`${base}.ts`, path.join(base, "index.ts")]) {
    try { execFileSync("git", ["cat-file", "-e", `HEAD:${sourceKey(candidate)}`], { cwd: repoRoot, stdio: "ignore" }); return candidate; } catch { /* try next */ }
  }
  return null;
}

async function parseModule(file) {
  const text = await readFile(file, "utf8");
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const imports = new Map();
  const routers = new Set();
  const mounts = [];
  const routes = [];
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && statement.importClause?.name && ts.isStringLiteral(statement.moduleSpecifier)) {
      const resolved = resolveImport(file, statement.moduleSpecifier.text);
      if (resolved) imports.set(statement.importClause.name.text, resolved);
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer && ts.isCallExpression(declaration.initializer) && declaration.initializer.expression.getText(source) === "Router") routers.add(declaration.name.text);
      }
    }
  }
  function visit(node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const method = node.expression.name.text;
      const owner = node.expression.expression.getText(source);
      const routeOwner = routers.has(owner) || owner === "this.app";
      if (routeOwner && HTTP_METHODS.has(method)) {
        const routePath = staticPath(node.arguments[0]);
        if (routePath === null) throw new Error(`unresolved route path at ${sourceKey(file)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
        routes.push({ method: method.toUpperCase(), path: routePath, line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1 });
      }
      if (routers.has(owner) && method === "use" && node.arguments.length >= 2) {
        const mountPath = staticPath(node.arguments[0]);
        const targetName = node.arguments[1]?.getText(source);
        if (mountPath !== null && imports.has(targetName)) mounts.push({ path: mountPath, target: imports.get(targetName) });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return { file, routes, mounts };
}

function applyPolicy(route, rules) {
  const matches = rules.filter((rule) => new RegExp(rule.path).test(route.path)
    && (!rule.methods || rule.methods.includes(route.method))
    && (!rule.excludePath || !new RegExp(rule.excludePath).test(route.path)));
  if (matches.length !== 1) throw new Error(`${matches.length ? "duplicate" : "missing"} route policy for ${route.method} ${route.path}`);
  const { id: policyId, path: _path, methods: _methods, excludePath: _exclude, ...policy } = matches[0];
  if (policy.classification === "ASC_SCOPED" && (!policy.permission || !policy.resourceType || !policy.resolver || !policy.allowedScopes?.length)) throw new Error(`invalid ASC_SCOPED policy ${policyId}`);
  if (policy.classification === "SECURITY_PRIVILEGED" && !policy.permission) throw new Error(`invalid SECURITY_PRIVILEGED policy ${policyId}`);
  return { policyId, ...policy };
}

function owningModule(source) {
  const match = source.match(/apps\/server\/src\/modules\/(?:v1\/)?([^/]+)/);
  if (match) return match[1];
  return source.includes("core/infra/bootstrap") ? "core-infrastructure" : "server-routing";
}

async function main() {
  const modules = new Map();
  async function load(file) {
    const key = path.resolve(file);
    if (modules.has(key)) return modules.get(key);
    const parsed = await parseModule(key);
    modules.set(key, parsed);
    for (const mount of parsed.mounts) await load(mount.target);
    return parsed;
  }
  const rootFile = path.join(sourceRoot, "routes/index.ts");
  await load(rootFile);
  const discovered = [];
  function walk(file, prefix, stack = new Set()) {
    if (stack.has(file)) throw new Error(`route mount cycle at ${sourceKey(file)}`);
    const module = modules.get(file);
    const nextStack = new Set(stack).add(file);
    for (const route of module.routes) discovered.push({ method: route.method, path: joinUrl(prefix, route.path), source: sourceKey(file), line: route.line });
    for (const mount of module.mounts) walk(mount.target, joinUrl(prefix, mount.path), nextStack);
  }
  walk(path.resolve(rootFile), "");
  const bootstrap = await parseModule(path.join(sourceRoot, "core/infra/bootstrap.ts"));
  for (const route of bootstrap.routes) discovered.push({ method: route.method, path: route.path, source: sourceKey(bootstrap.file), line: route.line });
  discovered.push({ method: "POST", path: "/api/copilotkit", source: "apps/server/src/modules/copilotkit/copilot-runtime.router.ts", line: 56, sourceKind: "EXPLICIT_FACTORY_ROUTE" });

  const rules = JSON.parse(await readFile(policyPath, "utf8")).rules;
  const routes = discovered.map((route) => {
    const policy = applyPolicy(route, rules);
    const mutation = !["GET", "HEAD", "OPTIONS"].includes(route.method);
    const highImpact = mutation && ["ASC_SCOPED", "SECURITY_PRIVILEGED"].includes(policy.classification);
    return {
      ...route,
      owningModule: owningModule(route.source),
      policy,
      audit: {
        denialEvent: "authorization.denied",
        decisionDigestRequired: highImpact,
        failurePolicy: highImpact ? "DENY" : "DEGRADED_BY_POLICY",
      },
      migration: {
        owner: "Engineering",
        status: policy.disposition ?? (policy.classification === "PUBLIC" ? "EXPLICIT_ALLOWLIST" : "P1R_PENDING"),
        negativeTestReference: "P1R_NEGATIVE_AUTHORIZATION_SUITE",
      },
    };
  }).sort((a, b) => `${a.path}:${a.method}`.localeCompare(`${b.path}:${b.method}`));
  const identities = new Set(routes.map((route) => `${route.method} ${route.path}`));
  if (identities.size !== routes.length) throw new Error("duplicate resolved Express route in inventory");
  const inventory = { schemaVersion: "1.0", generatedFrom: "TYPESCRIPT_AST_WITH_EXPLICIT_FACTORY_CONTRACTS", routeCount: routes.length, coverage: { classified: routes.length, percent: 100 }, routes };
  const serialized = `${JSON.stringify(inventory, null, 2)}\n`;
  if (process.argv.includes("--check")) {
    const existing = await readFile(outputPath, "utf8");
    if (existing !== serialized) throw new Error("committed P1 route inventory is stale; run the generator and commit the result");
  } else {
    await writeFile(outputPath, serialized, "utf8");
  }
  console.log(`P1 route inventory generated: ${routes.length} routes`);
}

await main();
