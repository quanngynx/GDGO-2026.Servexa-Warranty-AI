import { createHash, verify } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function unsignedAttestation(attestation) {
  const unsigned = structuredClone(attestation);
  delete unsigned.signature;
  return Buffer.from(JSON.stringify(unsigned));
}

function isSha(value, length) {
  return new RegExp(`^[0-9a-f]{${length}}$`).test(value ?? "");
}

export async function validateApprovedAttestation({
  repoRoot,
  gate,
  signoff,
  evidencePath,
  expectedRegistry,
  expectedRegistryPath,
}) {
  const errors = [];
  let attestation;
  try {
    attestation = JSON.parse(await readFile(evidencePath, "utf8"));
  } catch {
    return [`${gate.phase} ${signoff.role} attestation must be valid JSON`];
  }

  if (attestation.schemaVersion !== "1.0") errors.push(`${gate.phase} ${signoff.role} attestation schemaVersion is invalid`);
  if (attestation.gate !== gate.phase) errors.push(`${gate.phase} ${signoff.role} attestation gate is invalid`);
  if (attestation.role !== signoff.role) errors.push(`${gate.phase} ${signoff.role} attestation role is invalid`);
  if (attestation.approver !== signoff.approver) errors.push(`${gate.phase} ${signoff.role} attestation approver does not match gate`);
  if (attestation.decision !== "APPROVED") errors.push(`${gate.phase} ${signoff.role} attestation decision must be APPROVED`);
  if (!attestation.reviewedAt || Number.isNaN(Date.parse(attestation.reviewedAt))) errors.push(`${gate.phase} ${signoff.role} attestation reviewedAt is invalid`);
  if (typeof attestation.statement !== "string" || attestation.statement.length < 20) errors.push(`${gate.phase} ${signoff.role} attestation statement is incomplete`);

  const registryBytes = await readFile(path.join(repoRoot, expectedRegistryPath));
  const evidence = attestation.evidence ?? {};
  if (evidence.registry !== expectedRegistryPath) errors.push(`${gate.phase} ${signoff.role} attestation registry path is invalid`);
  if (evidence.registrySha256 !== sha256(registryBytes)) errors.push(`${gate.phase} ${signoff.role} attestation registry digest is stale`);
  const sourceDigest = expectedRegistry.sourceDigest ?? expectedRegistry.source?.digest;
  const subjectCommit = expectedRegistry.subjectCommit ?? expectedRegistry.source?.commit;
  const subjectTree = expectedRegistry.subjectTree ?? expectedRegistry.source?.tree;
  if (evidence.sourceDigest !== sourceDigest) errors.push(`${gate.phase} ${signoff.role} attestation source digest is stale`);
  if (evidence.subjectCommit !== subjectCommit || !isSha(evidence.subjectCommit, 40)) errors.push(`${gate.phase} ${signoff.role} attestation subject commit is stale`);
  if (evidence.subjectTree !== subjectTree || !isSha(evidence.subjectTree, 40)) errors.push(`${gate.phase} ${signoff.role} attestation subject tree is stale`);

  const findings = attestation.findings ?? {};
  if (findings.critical !== 0 || findings.high !== 0 || findings.safetyInvariantViolations !== 0) {
    errors.push(`${gate.phase} ${signoff.role} attestation cannot approve unresolved safety/Critical/High findings`);
  }
  if (!Array.isArray(findings.mediumAccepted)) errors.push(`${gate.phase} ${signoff.role} attestation mediumAccepted must be an array`);
  for (const [index, finding] of (findings.mediumAccepted ?? []).entries()) {
    if (!finding?.id || !finding?.owner || !finding?.deadline || !finding?.compensatingControl || finding?.securityAccepted !== true) {
      errors.push(`${gate.phase} ${signoff.role} accepted Medium finding ${index} is incomplete`);
    }
  }

  const approverRegistry = JSON.parse(await readFile(path.join(repoRoot, "documents", "production-readiness", "approver-keys.json"), "utf8"));
  const key = approverRegistry.approvers?.find((item) => item.name === signoff.approver && item.role === signoff.role);
  if (!key || key.status !== "ACTIVE" || key.algorithm !== "Ed25519" || typeof key.publicKey !== "string") {
    errors.push(`${gate.phase} ${signoff.role} approver key is not actively enrolled`);
  } else if (attestation.signature?.algorithm !== "Ed25519" || typeof attestation.signature?.value !== "string") {
    errors.push(`${gate.phase} ${signoff.role} attestation signature is missing`);
  } else {
    try {
      if (!verify(null, unsignedAttestation(attestation), key.publicKey, Buffer.from(attestation.signature.value, "base64"))) {
        errors.push(`${gate.phase} ${signoff.role} attestation signature is invalid`);
      }
    } catch {
      errors.push(`${gate.phase} ${signoff.role} attestation signature is invalid`);
    }
  }
  return errors;
}

