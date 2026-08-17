import { createHash, verify } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getP1dEvidenceScope } from "./p1-source-digest.mjs";
import { assertEvidenceScopeMatchesGitSubject, validateHistoricalGitSubject } from "./evidence-scope.mjs";
import { validateApprovedAttestation } from "./evidence-attestation.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readinessRoot = path.join(repoRoot, "documents", "production-readiness");
const requireReady = process.argv.includes("--require-p1d-ready");
const DESIGN_GROUPS = new Set(["architecture", "identity-authorization", "permission-sod", "route-inventory", "migration-cutover", "threat-privacy", "test-evidence", "implementation-backlog"]);
const P1R_PROOF_GROUPS = new Set(["identity-contracts", "oidc-session-security", "scim-revocation", "authorization-negative", "asc-route-isolation", "maker-checker", "break-glass", "crypto-audit-privacy", "migration-rehearsal", "capacity-fault"]);

async function json(file) {
  return JSON.parse(await readFile(path.join(readinessRoot, file), "utf8"));
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function approvedSignoffs(gate, roles, errors, directory, registry = null, requireDistinct = true) {
  const signoffs = new Map((gate.signoffs ?? []).map((item) => [item.role, item]));
  const approvedNames = [];
  for (const role of roles) {
    const item = signoffs.get(role);
    if (!item) {
      errors.push(`${gate.phase} missing ${role} sign-off`);
      continue;
    }
    if (item.status === "APPROVED") {
      if (!item.approver || !item.evidence) errors.push(`${gate.phase} ${role} approval requires named approver and evidence`);
      else {
        approvedNames.push(item.approver);
        const root = path.join(readinessRoot, "signoffs", "p1", directory);
        const evidencePath = path.resolve(repoRoot, item.evidence);
        if (!evidencePath.startsWith(`${root}${path.sep}`)) errors.push(`${gate.phase} ${role} sign-off evidence is outside its exact directory`);
        else {
          try {
            if (!(await stat(evidencePath)).isFile()) errors.push(`${gate.phase} ${role} sign-off evidence is not a file`);
            else if (registry) errors.push(...await validateApprovedAttestation({ repoRoot, gate, signoff: item, evidencePath, expectedRegistry: registry, expectedRegistryPath: gate.evidenceRegistry }));
          }
          catch { errors.push(`${gate.phase} ${role} sign-off evidence is missing`); }
        }
      }
    }
  }
  if (requireDistinct && new Set(approvedNames).size !== approvedNames.length) errors.push(`${gate.phase} approvers must be different named humans`);
  return roles.every((role) => signoffs.get(role)?.status === "APPROVED" && signoffs.get(role)?.approver && signoffs.get(role)?.evidence);
}

async function validateP1dEvidence(gate, errors) {
  const registryPath = path.resolve(repoRoot, gate.evidenceRegistry ?? "");
  try {
    const registry = JSON.parse(await readFile(registryPath, "utf8"));
    if (registry.schemaVersion !== "1.0" || registry.gate !== "P1D" || registry.state !== "READY_FOR_SIGN_OFF") errors.push("invalid P1D evidence identity/state");
    if (!/^[0-9a-f]{40}$/.test(registry.source?.commit ?? "")) errors.push("P1D evidence commit is invalid");
    if (!/^[0-9a-f]{40}$/.test(registry.source?.tree ?? "")) errors.push("P1D evidence tree is invalid");
    if (!/^sha256:[0-9a-f]{64}$/.test(registry.source?.digest ?? "")) errors.push("P1D evidence source digest is invalid");
    if (!validateHistoricalGitSubject(repoRoot, registry.source?.commit, registry.source?.tree)) errors.push("P1D evidence Git subject commit/tree is unavailable or inconsistent");
    const sourceScope = await getP1dEvidenceScope(repoRoot);
    if (registry.source?.digest !== sourceScope.digest) errors.push("P1D evidence source digest is stale");
    if (registry.source?.scope?.id !== sourceScope.scopeId || registry.source?.scope?.version !== sourceScope.scopeVersion || registry.source?.scope?.manifest !== sourceScope.manifest || registry.source?.scope?.fileCount !== sourceScope.files.length) {
      errors.push("P1D evidence source scope metadata is stale or invalid");
    }
    try {
      assertEvidenceScopeMatchesGitSubject(repoRoot, sourceScope, registry.source?.commit);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "P1D evidence source is not bound to Git subject");
    }
    if (!registry.generatedAt || Number.isNaN(Date.parse(registry.generatedAt))) errors.push("P1D evidence generatedAt is invalid");
    if (!registry.scenarios || Object.keys(registry.scenarios).length === 0) errors.push("P1D evidence scenarios are required");
    if (!/^sha256:[0-9a-f]{64}$/.test(registry.environment?.toolchainDigest ?? "")) errors.push("P1D toolchain digest is invalid");
    if (!registry.environment?.tools || Object.keys(registry.environment.tools).length === 0) errors.push("P1D tool versions are required");
    if (registry.workflow?.runId !== null && typeof registry.workflow?.runId !== "string") errors.push("P1D workflow runId must be string or null");
    if (registry.workflow?.attempt !== null && typeof registry.workflow?.attempt !== "string") errors.push("P1D workflow attempt must be string or null");

    const signature = registry.manifestSignature;
    if (signature?.algorithm !== "Ed25519" || typeof signature.publicKey !== "string" || typeof signature.value !== "string") errors.push("P1D evidence requires Ed25519 signature");
    else {
      const unsigned = { ...registry };
      delete unsigned.manifestSignature;
      try {
        if (!verify(null, Buffer.from(JSON.stringify(unsigned)), signature.publicKey, Buffer.from(signature.value, "base64"))) errors.push("P1D evidence signature is invalid");
      } catch {
        errors.push("P1D evidence signature is invalid");
      }
    }
    const trustedEvidenceKey = await readFile(path.join(readinessRoot, "trust", "p1d-evidence-ed25519-public.pem"), "utf8");
    if (signature?.publicKey !== trustedEvidenceKey) errors.push("P1D evidence signer does not match the pinned trust key");

    const records = new Map((registry.evidence ?? []).map((item) => [item.type, item]));
    if (records.size !== (registry.evidence ?? []).length) errors.push("P1D evidence types must be unique");
    const expectedTypes = new Set(["ARCHITECTURE", "IDENTITY_AUTHORIZATION_DESIGN", "PERMISSION_SOD_MATRIX", "ROUTE_SECURITY_INVENTORY", "MIGRATION_CUTOVER", "THREAT_PRIVACY_CRYPTO", "TEST_EVIDENCE_SPECIFICATION", "IMPLEMENTATION_BACKLOG"]);
    for (const type of expectedTypes) if (records.get(type)?.result !== "PASS") errors.push(`P1D evidence did not pass: ${type}`);
    for (const record of registry.evidence ?? []) {
      const artifactPath = path.resolve(evidenceRoot(repoRoot), record.artifact ?? "");
      if (!artifactPath.startsWith(`${evidenceRoot(repoRoot)}${path.sep}`)) errors.push(`P1D evidence artifact escapes bundle: ${record.artifact}`);
      else {
        try {
          if (await sha256(artifactPath) !== record.sha256) errors.push(`P1D evidence checksum mismatch: ${record.artifact}`);
        } catch {
          errors.push(`P1D evidence artifact missing: ${record.artifact}`);
        }
      }
    }
    return { complete: expectedTypes.size > 0 && [...expectedTypes].every((type) => records.get(type)?.result === "PASS"), registry };
  } catch (error) {
    if (requireReady) errors.push(`cannot validate P1D evidence registry: ${error instanceof Error ? error.message : String(error)}`);
    return { complete: false, registry: null };
  }
}

function evidenceRoot(root) {
  return path.join(root, ".p1d", "evidence");
}

async function main() {
  const errors = [];
  const [p0a, p0b, p1d, p1r, p1p] = await Promise.all([json("p0a-gate.json"), json("p0-gate.json"), json("p1d-gate.json"), json("p1r-gate.json"), json("p1p-gate.json")]);

  if (p1d.schemaVersion !== 1 || p1d.phase !== "P1D" || p1d.kind !== "IDENTITY_AUTHORIZATION_DESIGN_READINESS") errors.push("invalid P1D gate identity");
  if (p1d.runtimeImplementationAllowed !== false || p1d.productionPhaseAllowed !== false) errors.push("P1D cannot authorize runtime or production implementation");
  const groupIds = new Set((p1d.designGroups ?? []).map((group) => group.id));
  if (groupIds.size !== (p1d.designGroups ?? []).length) errors.push("P1D design groups must be unique");
  for (const id of DESIGN_GROUPS) if (!groupIds.has(id)) errors.push(`P1D missing design group: ${id}`);
  for (const group of p1d.designGroups ?? []) {
    try { if (!(await stat(path.resolve(repoRoot, group.artifact))).isFile()) errors.push(`P1D group artifact is not a file: ${group.artifact}`); }
    catch { errors.push(`P1D group artifact is missing: ${group.artifact}`); }
  }
  for (const artifact of p1d.artifacts ?? []) {
    try { if (!(await stat(path.resolve(repoRoot, artifact))).isFile()) errors.push(`P1D control artifact is not a file: ${artifact}`); }
    catch { errors.push(`P1D control artifact is missing: ${artifact}`); }
  }

  const p1dEvidence = await validateP1dEvidence(p1d, errors);
  const designComplete = p1dEvidence.complete;
  const p1dApproved = await approvedSignoffs(p1d, ["Engineering", "Security"], errors, "p1d", p1dEvidence.registry);
  if (designComplete || requireReady) {
    const expected = designComplete ? (p1dApproved ? "CLOSED" : "READY_FOR_SIGN_OFF") : "IN_PROGRESS";
    if (p1d.status !== expected) errors.push(`P1D status must be ${expected}`);
    if (p1d.nextDesignPhaseAllowed !== (expected === "CLOSED")) errors.push("P1D nextDesignPhaseAllowed is true only when CLOSED");
  } else if (p1d.status === "CLOSED") errors.push("P1D cannot close without verifiable evidence");

  await approvedSignoffs(p1r, ["Engineering", "Security"], errors, "p1r");
  if (p1r.schemaVersion !== 1 || p1r.phase !== "P1R" || p1r.kind !== "SYNTHETIC_IDENTITY_AUTHORIZATION_REFERENCE") errors.push("invalid P1R gate identity");
  const p1rProofGroups = new Set(p1r.proofGroups ?? []);
  if (p1rProofGroups.size !== (p1r.proofGroups ?? []).length) errors.push("P1R proof groups must be unique");
  for (const group of P1R_PROOF_GROUPS) if (!p1rProofGroups.has(group)) errors.push(`P1R missing proof group: ${group}`);
  try {
    const p1rScopePath = path.resolve(repoRoot, p1r.evidenceScope ?? "");
    if (!p1rScopePath.startsWith(`${repoRoot}${path.sep}`)) errors.push("P1R evidenceScope escapes repository");
    else {
      const p1rScope = JSON.parse(await readFile(p1rScopePath, "utf8"));
      if (p1rScope.scopeId !== "P1R_SYNTHETIC_IDENTITY_AUTHORIZATION_REFERENCE") errors.push("P1R ownership manifest identity is invalid");
    }
  } catch {
    errors.push("P1R ownership manifest is missing or invalid");
  }
  for (const artifact of p1r.artifacts ?? []) {
    const artifactPath = path.resolve(repoRoot, artifact);
    if (!artifactPath.startsWith(`${repoRoot}${path.sep}`)) errors.push(`P1R artifact escapes repository: ${artifact}`);
    else {
      try { if (!(await stat(artifactPath)).isFile()) errors.push(`P1R artifact is not a file: ${artifact}`); }
      catch { errors.push(`P1R artifact is missing: ${artifact}`); }
    }
  }
  const p1rPrerequisitesClosed = p0a.status === "CLOSED" && p1d.status === "CLOSED";
  if (!p1rPrerequisitesClosed) {
    if (p1r.status !== "BLOCKED" || p1r.runtimeImplementationAllowed !== false || p1r.nextReferencePhaseAllowed !== false) errors.push("P1R must remain fully BLOCKED until P0A and P1D are CLOSED");
  } else {
    if (!["IN_PROGRESS", "READY_FOR_SIGN_OFF", "CLOSED"].includes(p1r.status)) errors.push("P1R must leave BLOCKED after P0A and P1D close");
    if (p1r.runtimeImplementationAllowed !== true) errors.push("P1R runtime implementation is allowed only after prerequisites close");
    if (p1r.nextReferencePhaseAllowed !== (p1r.status === "CLOSED")) errors.push("P1R nextReferencePhaseAllowed is true only when CLOSED");
  }
  const p1rStatuses = new Map((p1r.prerequisites ?? []).map((item) => [item.gate, item.currentStatus]));
  if (p1rStatuses.get("P0A") !== p0a.status || p1rStatuses.get("P1D") !== p1d.status) errors.push("P1R prerequisite status metadata is stale");
  if (p1r.productionPhaseAllowed !== false) errors.push("P1R can never authorize production work");

  await approvedSignoffs(p1p, ["Engineering", "Security", "Operations", "Product/Business"], errors, "p1p");
  const p1pPrerequisitesClosed = p0b.status === "CLOSED" && p1d.status === "CLOSED" && p1r.status === "CLOSED";
  if (!p1pPrerequisitesClosed) {
    if (p1p.status !== "BLOCKED" || p1p.runtimeImplementationAllowed !== false || p1p.productionPhaseAllowed !== false || p1p.nextProductionPhaseAllowed !== false) errors.push("P1P must remain fully BLOCKED until P0B, P1D and P1R are CLOSED");
  }
  const p1pStatuses = new Map((p1p.prerequisites ?? []).map((item) => [item.gate, item.currentStatus]));
  if (p1pStatuses.get("P0B") !== p0b.status || p1pStatuses.get("P1D") !== p1d.status || p1pStatuses.get("P1R") !== p1r.status) errors.push("P1P prerequisite status metadata is stale");

  if (requireReady && !designComplete) errors.push("P1D design evidence is incomplete");
  if (errors.length) {
    for (const error of errors) console.error(`P1 gate error: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`P1D gate valid: ${p1d.status}`);
  console.log(`P1D design evidence: ${designComplete ? "complete" : "external/not present"}`);
  console.log(`P1R gate: ${p1r.status}; P1P gate: ${p1p.status}`);
  console.log(`P0A: ${p0a.status}; P0B: ${p0b.status}; no P1 runtime or production progression is authorized.`);
}

await main();
