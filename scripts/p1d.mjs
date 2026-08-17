import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getP1dEvidenceScope } from "./p1-source-digest.mjs";
import { assertEvidenceScopeMatchesGitSubject } from "./evidence-scope.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const evidenceRoot = path.join(repoRoot, ".p1d", "evidence");
const action = process.argv[2] ?? "check";

const groups = [
  {
    id: "architecture",
    type: "ARCHITECTURE",
    files: ["documents/adr/ADR-014-p1-identity-tracks-and-trust-boundary.md"],
    fragments: ["P1D — Design", "P1R — Reference", "P1P — Production"],
  },
  {
    id: "identity-authorization",
    type: "IDENTITY_AUTHORIZATION_DESIGN",
    files: ["documents/production-readiness/P1_IDENTITY_AUTHORIZATION_DESIGN.md"],
    fragments: ["Express is a confidential OIDC BFF", "SCIM state is authoritative", "AuthorizationDecision", "Break-glass boundary"],
  },
  {
    id: "permission-sod",
    type: "PERMISSION_SOD_MATRIX",
    files: ["documents/production-readiness/P1_PERMISSION_SOD_MATRIX.md"],
    fragments: ["wildcard `*` is invalid", "Static conflict sets", "Dynamic invariants", "requester != approver"],
  },
  {
    id: "route-inventory",
    type: "ROUTE_SECURITY_INVENTORY",
    files: ["documents/production-readiness/P1_ROUTE_SECURITY_INVENTORY.md", "documents/production-readiness/p1-route-security-inventory.json"],
    fragments: ["Every route classified", "Unknown route policy", "Client ASC parameter grants access"],
  },
  {
    id: "migration-cutover",
    type: "MIGRATION_CUTOVER",
    files: ["documents/production-readiness/P1_MIGRATION_CUTOVER.md"],
    fragments: ["Single-authority invariant", "Unexplained privilege expansion", "never re-enables normal legacy login"],
  },
  {
    id: "threat-privacy",
    type: "THREAT_PRIVACY_CRYPTO",
    files: ["documents/production-readiness/P1_THREAT_MODEL_PRIVACY.md"],
    fragments: ["Threat register", "AES-256-GCM", "partitioned by enterprise environment"],
  },
  {
    id: "test-evidence",
    type: "TEST_EVIDENCE_SPECIFICATION",
    files: ["documents/production-readiness/P1_TEST_AND_EVIDENCE_PLAN.md"],
    fragments: ["Authorization safety bypass", "<=2 seconds", "p95 <50 ms", "Tamper fixture detection"],
  },
  {
    id: "implementation-backlog",
    type: "IMPLEMENTATION_BACKLOG",
    files: ["documents/production-readiness/P1_CODE_IMPLEMENTATION_PLAN.md"],
    fragments: ["R0 — Gate guardrails", "R5 — Runtime SoD", "R9 — Negative gate", "P1P adapter plan"],
  },
];

function run(command, args, capture = false) {
  const result = spawnSync(command, args, { cwd: repoRoot, encoding: "utf8", stdio: capture ? "pipe" : "inherit", env: { ...process.env, CI: process.env.CI ?? "true" } });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed (${result.status})\n${output}`);
  return output;
}

async function proveGroup(group) {
  const checks = [];
  for (const file of group.files) {
    const content = await readFile(path.join(repoRoot, file), "utf8");
    checks.push({ check: `file:${file}`, passed: content.trim().length > 0 });
    if (file.endsWith(".md")) for (const fragment of group.fragments) checks.push({ check: `contains:${fragment}`, passed: content.includes(fragment) });
    if (file.endsWith("p1-route-security-inventory.json")) {
      const inventory = JSON.parse(content);
      checks.push({ check: "route-inventory:coverage", passed: inventory.routeCount > 0 && inventory.coverage?.percent === 100 && inventory.coverage?.classified === inventory.routeCount });
    }
  }
  const passed = checks.every((check) => check.passed);
  const result = { schemaVersion: "1.0", group: group.id, result: passed ? "PASS" : "FAIL", checkedAt: new Date().toISOString(), files: group.files, checks };
  const directory = path.join(evidenceRoot, group.id);
  await mkdir(directory, { recursive: true });
  const artifact = path.join(directory, "results.json");
  await writeFile(artifact, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  if (!passed) throw new Error(`P1D design group failed: ${group.id}`);
  return { type: group.type, result: "PASS", reason: null, artifact: `${group.id}/results.json`, sha256: createHash("sha256").update(await readFile(artifact)).digest("hex") };
}

async function proof() {
  run(process.execPath, ["scripts/generate-p1-route-inventory.mjs"]);
  const sourceScope = await getP1dEvidenceScope(repoRoot);
  const subjectCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim();
  assertEvidenceScopeMatchesGitSubject(repoRoot, sourceScope, subjectCommit);
  await mkdir(evidenceRoot, { recursive: true });
  const evidence = [];
  for (const group of groups) evidence.push(await proveGroup(group));
  const tools = { node: process.version };
  const registry = {
    schemaVersion: "1.0",
    gate: "P1D",
    state: "READY_FOR_SIGN_OFF",
    source: {
      commit: subjectCommit,
      tree: execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: repoRoot, encoding: "utf8" }).trim(),
      digest: sourceScope.digest,
      scope: {
        id: sourceScope.scopeId,
        version: sourceScope.scopeVersion,
        manifest: sourceScope.manifest,
        fileCount: sourceScope.files.length,
      },
    },
    generatedAt: new Date().toISOString(),
    scenarios: { designConformance: "1.0.0", gateHierarchy: "1.0.0", evidenceIntegrity: "1.0.0" },
    evidence,
    environment: { toolchainDigest: `sha256:${createHash("sha256").update(JSON.stringify(tools)).digest("hex")}`, tools },
    workflow: { runId: process.env.GITHUB_RUN_ID ?? null, attempt: process.env.GITHUB_RUN_ATTEMPT ?? null },
    provenance: {
      mode: process.env.GITHUB_ACTIONS === "true" ? "GITHUB_ATTESTATION_PENDING" : "LOCAL_UNATTESTED",
      repository: process.env.GITHUB_REPOSITORY ?? "quanngynx/servexa-warranty-ai",
      workflow: process.env.GITHUB_WORKFLOW_REF ?? null,
    },
  };
  await writeFile(path.join(evidenceRoot, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  const gatePath = path.join(repoRoot, "documents/production-readiness/p1d-gate.json");
  const gate = JSON.parse(await readFile(gatePath, "utf8"));
  gate.status = "READY_FOR_SIGN_OFF";
  gate.nextDesignPhaseAllowed = false;
  gate.updatedAt = new Date().toISOString().slice(0, 10);
  await writeFile(gatePath, `${JSON.stringify(gate, null, 2)}\n`, "utf8");
  const p1rPath = path.join(repoRoot, "documents/production-readiness/p1r-gate.json");
  const p1r = JSON.parse(await readFile(p1rPath, "utf8"));
  const prerequisite = p1r.prerequisites?.find((item) => item.gate === "P1D");
  if (prerequisite) prerequisite.currentStatus = gate.status;
  await writeFile(p1rPath, `${JSON.stringify(p1r, null, 2)}\n`, "utf8");
  console.log(`P1D design proof passed: ${evidence.length}/${groups.length} groups`);
}

switch (action) {
  case "proof": await proof(); break;
  case "check": run(process.execPath, ["scripts/validate-p1-gates.mjs"]); break;
  case "gate": run(process.execPath, ["scripts/validate-p1-gates.mjs", "--require-p1d-ready"]); break;
  default: throw new Error(`Unknown P1D action: ${action}`);
}
