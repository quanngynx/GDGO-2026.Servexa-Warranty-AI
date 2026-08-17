import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { computeP0aSourceDigest, getP0aEvidenceScope } from "./p0a-source-digest.mjs";

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const proofIds = ["contracts", "identity", "ai-data-handling", "topology-network", "telemetry", "backup-restore", "capacity-harness"];

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function git(root, ...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

async function fixture({ evidence = true } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "servexa-p0a-validator-"));
  await mkdir(path.join(root, "scripts"), { recursive: true });
  await copyFile(path.join(sourceRoot, "scripts", "validate-p0a-gate.mjs"), path.join(root, "scripts", "validate-p0a-gate.mjs"));
  await copyFile(path.join(sourceRoot, "scripts", "p0a-source-digest.mjs"), path.join(root, "scripts", "p0a-source-digest.mjs"));
  await copyFile(path.join(sourceRoot, "scripts", "evidence-scope.mjs"), path.join(root, "scripts", "evidence-scope.mjs"));
  await copyFile(path.join(sourceRoot, "scripts", "evidence-attestation.mjs"), path.join(root, "scripts", "evidence-attestation.mjs"));
  await copyFile(path.join(sourceRoot, "scripts", "github-evidence-attestation.mjs"), path.join(root, "scripts", "github-evidence-attestation.mjs"));
  await writeFile(path.join(root, ".gitignore"), ".p0a/\n", "utf8");
  await writeFile(path.join(root, "proof-definition.txt"), "proof-v1\n", "utf8");
  const gate = {
    schemaVersion: 1, phase: "P0A", kind: "SYNTHETIC_TECHNICAL_READINESS", status: "READY_FOR_SIGN_OFF",
    updatedAt: "2026-08-16", nextReferencePhaseAllowed: false, productionPhaseAllowed: false,
    evidenceRegistry: ".p0a/evidence/registry.json",
    proofGroups: proofIds.map((id) => ({ id, label: id })),
    signoffs: [{ role: "Engineering", status: "PENDING", approver: null, evidence: null }, { role: "Security", status: "PENDING", approver: null, evidence: null }],
    artifacts: ["proof-definition.txt"],
  };
  await writeJson(path.join(root, "documents", "production-readiness", "p0a-gate.json"), gate);
  await writeJson(path.join(root, "documents", "production-readiness", "p0-gate.json"), { phase: "P0", status: "BLOCKED", nextPhaseAllowed: false });
  await writeJson(path.join(root, "documents", "production-readiness", "evidence-scopes", "p0a.json"), {
    schemaVersion: 1,
    scopeId: "P0A_SYNTHETIC_TECHNICAL_READINESS",
    scopeVersion: "fixture-v1",
    includes: [
      "scripts/evidence-scope.mjs",
      "scripts/p0a-source-digest.mjs",
      "scripts/validate-p0a-gate.mjs",
      "documents/production-readiness/p0a-gate.json",
      "proof-definition.txt",
    ],
    requiredOwnedPaths: ["proof-definition.txt"],
    jsonNormalization: [{
      path: "documents/production-readiness/p0a-gate.json",
      replaceTopLevel: {
        status: "__STATUS_METADATA__",
        updatedAt: "__UPDATED_AT_METADATA__",
        nextReferencePhaseAllowed: "__NEXT_PHASE_METADATA__",
        signoffs: "__SIGNOFF_METADATA__",
      },
    }],
  });
  git(root, "init", "-q");
  git(root, "config", "user.email", "p0a@example.invalid");
  git(root, "config", "user.name", "P0A Test");
  git(root, "add", ".");
  git(root, "commit", "-qm", "fixture");

  if (evidence) {
    const evidenceDir = path.join(root, ".p0a", "evidence");
    await mkdir(evidenceDir, { recursive: true });
    const records = [];
    for (const proofId of proofIds) {
      const artifactPath = path.join(evidenceDir, `${proofId}.log`);
      await writeFile(artifactPath, `${proofId}: passed\n`, "utf8");
      records.push({ proofId, status: "PASSED", reason: null, toolVersions: { node: process.version }, imageVersions: { synthetic: "sha256:fixture" }, artifacts: [{ path: `.p0a/evidence/${proofId}.log`, sha256: createHash("sha256").update(await readFile(artifactPath)).digest("hex") }] });
    }
    const sourceScope = await getP0aEvidenceScope(root);
    const registry = {
      schemaVersion: 1, subjectCommit: git(root, "rev-parse", "HEAD"), subjectTree: git(root, "rev-parse", "HEAD^{tree}"),
      sourceDigest: await computeP0aSourceDigest(root),
      sourceScope: { id: sourceScope.scopeId, version: sourceScope.scopeVersion, manifest: sourceScope.manifest, fileCount: sourceScope.files.length },
      workflowRunId: null, workflowRunAttempt: null,
      generatedAt: new Date().toISOString(), scenarioVersion: "p0a-v2", records,
      provenance: { mode: "LOCAL_UNATTESTED", repository: "quanngynx/servexa-warranty-ai", workflow: null },
    };
    await writeJson(path.join(evidenceDir, "registry.json"), registry);
  }
  return { root, gate };
}

function validate(root, requireReady = true) {
  return spawnSync(process.execPath, [path.join(root, "scripts", "validate-p0a-gate.mjs"), ...(requireReady ? ["--require-ready"] : [])], { cwd: root, encoding: "utf8" });
}

test("accepts later-phase commits outside ownership and rejects owned-source drift", async () => {
  const { root } = await fixture();
  const initial = validate(root);
  assert.equal(initial.status, 0, initial.stderr);
  await mkdir(path.join(root, "later-phase"), { recursive: true });
  await writeFile(path.join(root, "later-phase", "runtime.ts"), "export const later = true;\n", "utf8");
  git(root, "add", ".");
  git(root, "commit", "-qm", "later phase outside P0A scope");
  assert.equal(validate(root).status, 0);
  await writeFile(path.join(root, "proof-definition.txt"), "proof-v2\n", "utf8");
  const stale = validate(root);
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /sourceDigest is stale/);
});

test("rejects an explicit dependency edge whose target is outside ownership", async () => {
  const { root } = await fixture();
  await writeFile(path.join(root, "unowned-dependency.txt"), "dependency\n", "utf8");
  const manifestPath = path.join(root, "documents", "production-readiness", "evidence-scopes", "p0a.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  manifest.dependencyEdges = [{ from: "proof-definition.txt", to: "unowned-dependency.txt", reference: "proof" }];
  await writeJson(manifestPath, manifest);
  await assert.rejects(() => computeP0aSourceDigest(root), /dependency edge is outside evidence scope/);
});

test("rejects artifact tampering and invalid provenance", async () => {
  const { root } = await fixture();
  await writeFile(path.join(root, ".p0a", "evidence", "contracts.log"), "tampered\n", "utf8");
  assert.match(validate(root).stderr, /artifact checksum mismatch/);
  const registryPath = path.join(root, ".p0a", "evidence", "registry.json");
  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  registry.provenance.repository = "attacker/example";
  await writeJson(registryPath, registry);
  assert.match(validate(root).stderr, /provenance repository is invalid/);
});

test("local evidence can never close the gate", async () => {
  const { root, gate } = await fixture();
  const signoffRoot = path.join(root, "documents", "production-readiness", "signoffs", "p0a");
  await mkdir(signoffRoot, { recursive: true });
  await writeFile(path.join(signoffRoot, "engineering.md"), "Engineering approved\n", "utf8");
  await writeFile(path.join(signoffRoot, "security.md"), "Security approved\n", "utf8");
  gate.status = "CLOSED";
  gate.updatedAt = "2026-08-17";
  gate.nextReferencePhaseAllowed = true;
  gate.signoffs = [
    { role: "Engineering", status: "APPROVED", approver: "Engineering Approver", evidence: "documents/production-readiness/signoffs/p0a/engineering.md" },
    { role: "Security", status: "APPROVED", approver: "Security Approver", evidence: "documents/production-readiness/signoffs/p0a/security.md" },
  ];
  await writeJson(path.join(root, "documents", "production-readiness", "p0a-gate.json"), gate);
  const result = validate(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /requires GitHub OIDC verified evidence provenance|attestation must be valid JSON/);
});

test("lightweight validation permits READY metadata when raw evidence is an external CI artifact", async () => {
  const { root } = await fixture({ evidence: false });
  assert.equal(validate(root, false).status, 0);
  assert.equal(validate(root, true).status, 1);
});
