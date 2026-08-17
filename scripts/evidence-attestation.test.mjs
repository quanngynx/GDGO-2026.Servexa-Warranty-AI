import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { allowedSignerKeyMaterial, validateApprovedAttestation } from "./evidence-attestation.mjs";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "servexa-attestation-"));
  const readiness = path.join(root, "documents/production-readiness");
  const signoffDir = path.join(readiness, "signoffs/p0a");
  const evidenceDir = path.join(root, ".p0a/evidence");
  await Promise.all([mkdir(signoffDir, { recursive: true }), mkdir(evidenceDir, { recursive: true })]);
  await writeFile(path.join(readiness, "approver-identities.json"), JSON.stringify({ schemaVersion: "1.0", approvers: [{ name: "Reviewer", role: "Engineering", principal: "reviewer", allowedSignersVariable: "ENGINEERING_ALLOWED_SIGNERS" }] }));
  const registryPath = ".p0a/evidence/registry.json";
  const registry = {
    subjectCommit: "a".repeat(40), subjectTree: "b".repeat(40), sourceDigest: `sha256:${"c".repeat(64)}`,
    workflowRunId: "123", workflowRunAttempt: "1",
  };
  const registryBytes = Buffer.from(JSON.stringify(registry));
  const bundleBytes = Buffer.from("bundle-v1\n");
  await writeFile(path.join(root, registryPath), registryBytes);
  await writeFile(path.join(evidenceDir, "bundle.json"), bundleBytes);
  const attestationPath = path.join(signoffDir, "engineering.attestation.json");
  const attestation = {
    schemaVersion: "2.0", gate: "P0A", role: "Engineering", approver: "Reviewer", principal: "reviewer", decision: "APPROVED",
    reviewedAt: "2026-08-17T00:00:00.000Z",
    evidence: {
      repository: "quanngynx/servexa-warranty-ai", githubAttestation: "attestation-123", registry: registryPath,
      registrySha256: sha256(registryBytes), bundleSha256: sha256(bundleBytes), sourceDigest: registry.sourceDigest,
      subjectCommit: registry.subjectCommit, subjectTree: registry.subjectTree, workflowRunId: "123", workflowRunAttempt: "1",
    },
    findings: { critical: 0, high: 0, mediumAccepted: [], safetyInvariantViolations: 0 },
    statement: "I independently reviewed and approve this exact evidence bundle.",
  };
  await writeFile(attestationPath, `${JSON.stringify(attestation, null, 2)}\n`);
  const keyPath = path.join(root, "reviewer-key");
  execFileSync("ssh-keygen", ["-q", "-t", "ed25519", "-N", "", "-f", keyPath]);
  execFileSync("ssh-keygen", ["-Y", "sign", "-f", keyPath, "-n", "servexa-gate", attestationPath]);
  const publicKey = (await readFile(`${keyPath}.pub`, "utf8")).trim();
  return { root, registry, registryPath, attestation, attestationPath, allowedSigners: `reviewer ${publicKey}` };
}

test("accepts exact OpenSSH namespace, principal and evidence binding", async () => {
  const data = await fixture();
  process.env.ENGINEERING_ALLOWED_SIGNERS = data.allowedSigners;
  const errors = await validateApprovedAttestation({ repoRoot: data.root, gate: { phase: "P0A" }, signoff: { role: "Engineering", approver: "Reviewer" }, evidencePath: data.attestationPath, expectedRegistry: data.registry, expectedRegistryPath: data.registryPath });
  assert.deepEqual(errors, []);
});

test("rejects a stale digest and wrong allowed signer principal", async () => {
  const data = await fixture();
  data.attestation.evidence.bundleSha256 = "0".repeat(64);
  await writeFile(data.attestationPath, `${JSON.stringify(data.attestation, null, 2)}\n`);
  process.env.ENGINEERING_ALLOWED_SIGNERS = data.allowedSigners.replace("reviewer ", "someone-else ");
  const errors = await validateApprovedAttestation({ repoRoot: data.root, gate: { phase: "P0A" }, signoff: { role: "Engineering", approver: "Reviewer" }, evidencePath: data.attestationPath, expectedRegistry: data.registry, expectedRegistryPath: data.registryPath });
  assert.ok(errors.some((error) => error.includes("bundle binding is stale")));
  assert.ok(errors.some((error) => error.includes("OpenSSH signature is invalid")));
});

test("detects the same key hidden behind different principals", () => {
  const key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFixture";
  assert.equal(allowedSignerKeyMaterial(`engineering ${key}`), allowedSignerKeyMaterial(`security ${key}`));
});
