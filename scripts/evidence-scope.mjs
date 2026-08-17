import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

function git(repoRoot, ...args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
}

function gitBuffer(repoRoot, ...args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: null });
}

function normalizeRelativePath(value) {
  const normalized = value.replaceAll("\\", "/");
  if (!normalized || normalized.startsWith("/") || normalized.includes("../")) {
    throw new Error(`evidence scope path escapes repository: ${value}`);
  }
  return normalized;
}

function globRegex(pattern) {
  let output = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    if (character === "*" && pattern[index + 1] === "*") {
      output += ".*";
      index += 1;
    } else if (character === "*") output += "[^/]*";
    else if (character === "?") output += "[^/]";
    else output += character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`${output}$`);
}

function replaceTopLevelFields(value, replacements) {
  const clone = structuredClone(value);
  for (const [field, replacement] of Object.entries(replacements ?? {})) {
    if (Object.hasOwn(clone, field)) clone[field] = replacement;
  }
  return clone;
}

function selectFiles(candidates, manifestPath, manifest) {
  const selected = new Set([manifestPath]);
  for (const rawPattern of manifest.includes ?? []) {
    const pattern = normalizeRelativePath(rawPattern);
    const matcher = globRegex(pattern);
    const matches = candidates.filter((candidate) => matcher.test(candidate));
    if (matches.length === 0) throw new Error(`evidence scope pattern matched no files: ${pattern}`);
    for (const match of matches) selected.add(match);
  }
  for (const rawPath of manifest.requiredOwnedPaths ?? []) {
    const requiredPath = normalizeRelativePath(rawPath);
    if (!selected.has(requiredPath)) throw new Error(`required owned path is outside evidence scope: ${requiredPath}`);
  }
  return selected;
}

function hashScopedFiles(files, manifest, readContent) {
  const normalizers = new Map(
    (manifest.jsonNormalization ?? []).map((item) => [normalizeRelativePath(item.path), item.replaceTopLevel ?? {}]),
  );
  const hash = createHash("sha256");
  for (const file of files) {
    let content = readContent(file);
    const replacements = normalizers.get(file);
    if (replacements) {
      const parsed = JSON.parse(content.toString("utf8"));
      content = Buffer.from(`${JSON.stringify(replaceTopLevelFields(parsed, replacements))}\n`, "utf8");
    }
    hash.update(file);
    hash.update("\0");
    hash.update(content);
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}

async function validateDeclaredDependencies(repoRoot, manifest, selected) {
  for (const edge of manifest.dependencyEdges ?? []) {
    const from = normalizeRelativePath(edge.from);
    const to = normalizeRelativePath(edge.to);
    if (!selected.has(from) || !selected.has(to)) {
      throw new Error(`dependency edge is outside evidence scope: ${from} -> ${to}`);
    }
    const source = await readFile(path.join(repoRoot, from), "utf8");
    const reference = edge.reference ?? to;
    if (!source.includes(reference)) throw new Error(`dependency reference is missing: ${from} -> ${to}`);
  }
}

async function validateDiscoveredDependencies(repoRoot, manifest, selected, candidates) {
  const candidateSet = new Set(candidates);
  const extensions = ["", ".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".py", ".sql", ".yaml", ".yml", ".sh"];
  for (const rawSource of manifest.dependencyDiscovery?.sources ?? []) {
    const sourcePath = normalizeRelativePath(rawSource);
    if (!selected.has(sourcePath)) throw new Error(`dependency discovery source is outside evidence scope: ${sourcePath}`);
    const source = await readFile(path.join(repoRoot, sourcePath), "utf8");
    const references = new Set();
    const patterns = [
      /(?:from\s+|import\s*\(|require\s*\()\s*["'](\.{1,2}\/[^"']+)["']/g,
      /(?:node|python|python3)\s+([A-Za-z0-9_./\\-]+\.(?:mjs|cjs|js|ts|py))/g,
      /(?:source|file|dockerfile|env_file)\s*:\s*["']?(\.{0,2}\/?[A-Za-z0-9_./\\-]+)/gi,
    ];
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) references.add(match[1]);
    }
    for (const rawReference of references) {
      const base = rawReference.startsWith(".")
        ? path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), rawReference.replaceAll("\\", "/")))
        : normalizeRelativePath(rawReference);
      const possible = [];
      for (const extension of extensions) possible.push(`${base}${extension}`);
      for (const extension of extensions.slice(1)) possible.push(`${base}/index${extension}`);
      const resolved = possible.find((item) => candidateSet.has(item));
      if (resolved && !selected.has(resolved)) {
        throw new Error(`discovered dependency is outside evidence scope: ${sourcePath} -> ${resolved}`);
      }
    }
  }
}

export async function resolveEvidenceScope(repoRoot, manifestRelativePath) {
  const manifestPath = normalizeRelativePath(manifestRelativePath);
  const manifest = JSON.parse(await readFile(path.join(repoRoot, manifestPath), "utf8"));
  if (manifest.schemaVersion !== 1 || typeof manifest.scopeId !== "string" || typeof manifest.scopeVersion !== "string") {
    throw new Error(`invalid evidence scope manifest: ${manifestPath}`);
  }

  const candidates = git(repoRoot, "ls-files", "-co", "--exclude-standard")
    .split(/\r?\n/)
    .filter(Boolean)
    .map(normalizeRelativePath);
  const selected = selectFiles(candidates, manifestPath, manifest);
  await validateDeclaredDependencies(repoRoot, manifest, selected);
  await validateDiscoveredDependencies(repoRoot, manifest, selected, candidates);
  const files = [...selected].sort();
  const contents = new Map(await Promise.all(files.map(async (file) => [file, await readFile(path.join(repoRoot, file))])));

  return {
    scopeId: manifest.scopeId,
    scopeVersion: manifest.scopeVersion,
    manifest: manifestPath,
    files,
    digest: hashScopedFiles(files, manifest, (file) => contents.get(file)),
  };
}

export function resolveEvidenceScopeFromGitSubject(repoRoot, manifestRelativePath, commit) {
  const manifestPath = normalizeRelativePath(manifestRelativePath);
  if (!/^[0-9a-f]{40}$/.test(commit ?? "")) throw new Error("evidence subject commit must be a full Git SHA");
  let manifest;
  try {
    manifest = JSON.parse(gitBuffer(repoRoot, "show", `${commit}:${manifestPath}`).toString("utf8"));
  } catch {
    throw new Error(`evidence scope manifest is absent from Git subject: ${manifestPath}`);
  }
  const candidates = git(repoRoot, "ls-tree", "-r", "--name-only", commit)
    .split(/\r?\n/)
    .filter(Boolean)
    .map(normalizeRelativePath);
  const selected = selectFiles(candidates, manifestPath, manifest);
  const files = [...selected].sort();
  const digest = hashScopedFiles(files, manifest, (file) => gitBuffer(repoRoot, "show", `${commit}:${file}`));
  return {
    scopeId: manifest.scopeId,
    scopeVersion: manifest.scopeVersion,
    manifest: manifestPath,
    files,
    digest,
  };
}

export function assertEvidenceScopeMatchesGitSubject(repoRoot, currentScope, commit) {
  const historical = resolveEvidenceScopeFromGitSubject(repoRoot, currentScope.manifest, commit);
  if (historical.scopeId !== currentScope.scopeId || historical.scopeVersion !== currentScope.scopeVersion) {
    throw new Error("evidence scope identity differs from Git subject");
  }
  if (historical.digest !== currentScope.digest) {
    throw new Error("evidence ownership digest is not reconstructible from Git subject");
  }
  return historical;
}

export function validateHistoricalGitSubject(repoRoot, commit, tree) {
  if (!/^[0-9a-f]{40}$/.test(commit ?? "") || !/^[0-9a-f]{40}$/.test(tree ?? "")) return false;
  try {
    execFileSync("git", ["cat-file", "-e", `${commit}^{commit}`], { cwd: repoRoot, stdio: "ignore" });
    return git(repoRoot, "show", "-s", "--format=%T", commit) === tree;
  } catch {
    return false;
  }
}
