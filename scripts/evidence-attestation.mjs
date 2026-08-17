import { createHash, randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const isSha = (value, length) => new RegExp(`^[0-9a-f]{${length}}$`).test(value ?? "");

export function allowedSignerKeyMaterial(entry) {
  const fields = (entry ?? "").trim().split(/\s+/);
  const typeIndex = fields.findIndex((field) => /^(?:ssh-ed25519|ecdsa-sha2-|sk-ssh-ed25519|rsa-sha2-)/.test(field));
  return typeIndex >= 0 && fields[typeIndex + 1] ? `${fields[typeIndex]} ${fields[typeIndex + 1]}` : null;
}

async function verifyOpenSshSignature({ bytes, signaturePath, allowedSigners, principal }) {
  const allowedSignersPath = path.join(os.tmpdir(), `servexa-allowed-signers-${randomUUID()}`);
  try {
    await writeFile(allowedSignersPath, `${allowedSigners.trim()}\n`, { mode: 0o600 });
    const result = spawnSync("ssh-keygen", ["-Y", "verify", "-f", allowedSignersPath, "-I", principal, "-n", "servexa-gate", "-s", signaturePath], {
      input: bytes,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return result.status === 0;
  } finally {
    await rm(allowedSignersPath, { force: true });
  }
}

export async function validateApprovedAttestation({ repoRoot, gate, signoff, evidencePath, expectedRegistry, expectedRegistryPath }) {
  const errors = [];
  let attestation;
  let attestationBytes;
  try {
    attestationBytes = await readFile(evidencePath);
    attestation = JSON.parse(attestationBytes.toString("utf8"));
  } catch {
    return [`${gate.phase} ${signoff.role} attestation must be valid JSON`];
  }
  const identities = JSON.parse(await readFile(path.join(repoRoot, "documents", "production-readiness", "approver-identities.json"), "utf8"));
  const identity = identities.approvers?.find((item) => item.name === signoff.approver && item.role === signoff.role);
  if (!identity) errors.push(`${gate.phase} ${signoff.role} approver identity is not registered`);

  if (attestation.schemaVersion !== "2.0" || attestation.gate !== gate.phase || attestation.role !== signoff.role) errors.push(`${gate.phase} ${signoff.role} attestation identity is invalid`);
  if (attestation.approver !== signoff.approver || attestation.principal !== identity?.principal) errors.push(`${gate.phase} ${signoff.role} attestation approver/principal is invalid`);
  if (attestation.decision !== "APPROVED") errors.push(`${gate.phase} ${signoff.role} attestation decision must be APPROVED`);
  if (!attestation.reviewedAt || Number.isNaN(Date.parse(attestation.reviewedAt))) errors.push(`${gate.phase} ${signoff.role} attestation reviewedAt is invalid`);
  if (typeof attestation.statement !== "string" || attestation.statement.length < 20) errors.push(`${gate.phase} ${signoff.role} attestation statement is incomplete`);

  const registryBytes = await readFile(path.join(repoRoot, expectedRegistryPath));
  const bundlePath = path.join(repoRoot, gate.phase === "P0A" ? ".p0a/evidence/bundle.json" : ".p1d/evidence/bundle.json");
  let bundleBytes;
  try { bundleBytes = await readFile(bundlePath); } catch { errors.push(`${gate.phase} evidence bundle is missing`); }
  const evidence = attestation.evidence ?? {};
  const sourceDigest = expectedRegistry.sourceDigest ?? expectedRegistry.source?.digest;
  const subjectCommit = expectedRegistry.subjectCommit ?? expectedRegistry.source?.commit;
  const subjectTree = expectedRegistry.subjectTree ?? expectedRegistry.source?.tree;
  if (evidence.registry !== expectedRegistryPath || evidence.registrySha256 !== sha256(registryBytes)) errors.push(`${gate.phase} ${signoff.role} registry binding is stale`);
  if (!bundleBytes || evidence.bundleSha256 !== sha256(bundleBytes)) errors.push(`${gate.phase} ${signoff.role} bundle binding is stale`);
  if (evidence.sourceDigest !== sourceDigest || evidence.subjectCommit !== subjectCommit || evidence.subjectTree !== subjectTree) errors.push(`${gate.phase} ${signoff.role} source binding is stale`);
  if (!isSha(evidence.subjectCommit, 40) || !isSha(evidence.subjectTree, 40)) errors.push(`${gate.phase} ${signoff.role} Git subject is invalid`);
  if (evidence.repository !== "quanngynx/servexa-warranty-ai" || typeof evidence.githubAttestation !== "string" || evidence.githubAttestation.length < 1) errors.push(`${gate.phase} ${signoff.role} GitHub provenance reference is invalid`);
  const workflowRunId = expectedRegistry.workflowRunId ?? expectedRegistry.workflow?.runId;
  const workflowRunAttempt = expectedRegistry.workflowRunAttempt ?? expectedRegistry.workflow?.attempt;
  if (evidence.workflowRunId !== workflowRunId || evidence.workflowRunAttempt !== workflowRunAttempt) errors.push(`${gate.phase} ${signoff.role} workflow run binding is stale`);

  const findings = attestation.findings ?? {};
  if (findings.critical !== 0 || findings.high !== 0 || findings.safetyInvariantViolations !== 0) errors.push(`${gate.phase} ${signoff.role} cannot approve unresolved safety/Critical/High findings`);
  if (!Array.isArray(findings.mediumAccepted)) errors.push(`${gate.phase} ${signoff.role} mediumAccepted must be an array`);
  for (const [index, finding] of (findings.mediumAccepted ?? []).entries()) {
    if (!finding?.id || !finding?.owner || !finding?.deadline || !finding?.compensatingControl || finding?.securityAccepted !== true) errors.push(`${gate.phase} ${signoff.role} accepted Medium finding ${index} is incomplete`);
  }

  const allowedSigners = identity ? process.env[identity.allowedSignersVariable] : null;
  if (!allowedSigners) errors.push(`${gate.phase} ${signoff.role} allowed signers are not configured by GitHub Environment`);
  else {
    try {
      if (!await verifyOpenSshSignature({ bytes: attestationBytes, signaturePath: `${evidencePath}.sig`, allowedSigners, principal: identity.principal })) errors.push(`${gate.phase} ${signoff.role} OpenSSH signature is invalid`);
    } catch {
      errors.push(`${gate.phase} ${signoff.role} OpenSSH signature is missing or invalid`);
    }
  }
  return errors;
}
