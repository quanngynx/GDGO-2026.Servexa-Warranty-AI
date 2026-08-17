import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeP1SourceDigest, getP1dEvidenceScope } from "./p1-source-digest.mjs";
import { getP1rEvidenceScope } from "./p1r-source-digest.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readinessRoot = path.join(repoRoot, "documents", "production-readiness");
const readJson = async (file) => JSON.parse(await readFile(path.join(readinessRoot, file), "utf8"));

test("P1D registry is source-bound, checksummed and locally untrusted", async () => {
  const registry = JSON.parse(await readFile(path.join(repoRoot, ".p1d", "evidence", "registry.json"), "utf8"));
  assert.equal(registry.gate, "P1D");
  assert.equal(registry.state, "READY_FOR_SIGN_OFF");
  assert.equal(registry.source.digest, await computeP1SourceDigest(repoRoot));
  const sourceScope = await getP1dEvidenceScope(repoRoot);
  assert.deepEqual(registry.source.scope, {
    id: sourceScope.scopeId,
    version: sourceScope.scopeVersion,
    manifest: sourceScope.manifest,
    fileCount: sourceScope.files.length,
  });
  assert.ok(["LOCAL_UNATTESTED", "GITHUB_ATTESTATION_PENDING"].includes(registry.provenance.mode));
  assert.equal(registry.provenance.repository, "quanngynx/servexa-warranty-ai");
  for (const record of registry.evidence) {
    const artifact = await readFile(path.join(repoRoot, ".p1d", "evidence", record.artifact));
    assert.equal(createHash("sha256").update(artifact).digest("hex"), record.sha256);
  }
});

test("P1D and P1R ownership scopes are separated", async () => {
  const [p1dScope, p1rScope] = await Promise.all([
    getP1dEvidenceScope(repoRoot),
    getP1rEvidenceScope(repoRoot),
  ]);
  assert.equal(p1dScope.files.includes("scripts/p1r.mjs"), false);
  assert.equal(p1dScope.files.includes("documents/production-readiness/p1r-gate.json"), false);
  assert.equal(p1rScope.files.includes("scripts/p1r.mjs"), true);
  assert.equal(p1rScope.files.includes("documents/production-readiness/p1r-gate.json"), true);
});

test("P1R and P1P remain blocked by machine-readable prerequisites", async () => {
  const [p0a, p0b, p1d, p1r, p1p] = await Promise.all([readJson("p0a-gate.json"), readJson("p0-gate.json"), readJson("p1d-gate.json"), readJson("p1r-gate.json"), readJson("p1p-gate.json")]);
  assert.notEqual(p0a.status, "CLOSED");
  assert.equal(p0b.status, "BLOCKED");
  assert.notEqual(p1d.status, "CLOSED");
  for (const gate of [p1r, p1p]) {
    assert.equal(gate.status, "BLOCKED");
    assert.equal(gate.runtimeImplementationAllowed, false);
    assert.equal(gate.productionPhaseAllowed, false);
  }
});

test("strict P1 gate validator accepts current source-bound design evidence", () => {
  const output = execFileSync(process.execPath, ["scripts/validate-p1-gates.mjs", "--require-p1d-ready"], { cwd: repoRoot, encoding: "utf8" });
  assert.match(output, /P1D gate valid: READY_FOR_SIGN_OFF/);
  assert.match(output, /P1R gate: BLOCKED; P1P gate: BLOCKED/);
});
