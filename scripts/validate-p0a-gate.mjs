import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getP0aEvidenceScope } from "./p0a-source-digest.mjs";
import { assertEvidenceScopeMatchesGitSubject, validateHistoricalGitSubject } from "./evidence-scope.mjs";
import { allowedSignerKeyMaterial, validateApprovedAttestation } from "./evidence-attestation.mjs";
import { verifyGithubEvidenceAttestation } from "./github-evidence-attestation.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gatePath = path.join(repoRoot, "documents", "production-readiness", "p0a-gate.json");
const p0bPath = path.join(repoRoot, "documents", "production-readiness", "p0-gate.json");
const requireReady = process.argv.includes("--require-ready");
const REQUIRED_GROUPS = new Set([
  "contracts", "identity", "ai-data-handling", "topology-network",
  "telemetry", "backup-restore", "capacity-harness",
]);
const ALLOWED_STATUSES = new Set(["IN_PROGRESS", "READY_FOR_SIGN_OFF", "CLOSED"]);

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

function fail(errors) {
  for (const error of errors) console.error(`P0A gate error: ${error}`);
  process.exitCode = 1;
}

async function main() {
  const errors = [];
  const gate = JSON.parse(await readFile(gatePath, "utf8"));
  const p0b = JSON.parse(await readFile(p0bPath, "utf8"));

  if (p0b.phase !== "P0" || p0b.status !== "BLOCKED" || p0b.nextPhaseAllowed !== false) {
    errors.push("P0B must remain phase P0, BLOCKED, with nextPhaseAllowed=false");
  }
  if (gate.schemaVersion !== 1 || gate.phase !== "P0A" || gate.kind !== "SYNTHETIC_TECHNICAL_READINESS") {
    errors.push("invalid P0A manifest identity");
  }
  if (!ALLOWED_STATUSES.has(gate.status)) errors.push(`unsupported P0A status: ${gate.status}`);
  if (gate.productionPhaseAllowed !== false) errors.push("P0A must never allow a production phase");

  const groupIds = new Set((gate.proofGroups ?? []).map((group) => group.id));
  for (const id of REQUIRED_GROUPS) if (!groupIds.has(id)) errors.push(`missing proof group: ${id}`);

  const signoffs = new Map((gate.signoffs ?? []).map((signoff) => [signoff.role, signoff]));
  const approvedNames = [];
  for (const role of ["Engineering", "Security"]) {
    const signoff = signoffs.get(role);
    if (!signoff) errors.push(`missing sign-off: ${role}`);
    if (signoff?.status === "APPROVED" && (!signoff.approver || !signoff.evidence)) {
      errors.push(`${role} approval requires a named approver and evidence`);
    }
    if (signoff?.status === "APPROVED" && signoff.evidence) {
      approvedNames.push(signoff.approver);
      const evidencePath = path.resolve(repoRoot, signoff.evidence);
      const signoffRoot = path.join(repoRoot, "documents", "production-readiness", "signoffs", "p0a");
      if (!evidencePath.startsWith(`${signoffRoot}${path.sep}`)) {
        errors.push(`${role} sign-off evidence must stay under documents/production-readiness/signoffs/p0a`);
      } else {
        try {
          if (!(await stat(evidencePath)).isFile()) errors.push(`${role} sign-off evidence is not a file`);
        } catch {
          errors.push(`${role} sign-off evidence is missing`);
        }
      }
    }
  }
  if (approvedNames.length > 1 && new Set(approvedNames).size !== approvedNames.length) {
    errors.push("P0A approvers must be different named humans");
  }

  for (const artifact of gate.artifacts ?? []) {
    const absolute = path.resolve(repoRoot, artifact);
    if (!absolute.startsWith(`${repoRoot}${path.sep}`)) {
      errors.push(`artifact escapes repository: ${artifact}`);
      continue;
    }
    try {
      if (!(await stat(absolute)).isFile()) errors.push(`artifact is not a file: ${artifact}`);
    } catch {
      errors.push(`missing artifact: ${artifact}`);
    }
  }

  let allPassed = false;
  let registryAvailable = false;
  let registryData = null;
  const registryPath = path.resolve(repoRoot, gate.evidenceRegistry ?? "");
  try {
    const registry = JSON.parse(await readFile(registryPath, "utf8"));
    registryData = registry;
    registryAvailable = true;
    if (registry.schemaVersion !== 1) errors.push("evidence schemaVersion must be 1");
    if (!/^[0-9a-f]{40}$/.test(registry.subjectCommit ?? "")) errors.push("evidence subjectCommit must be a 40-character Git SHA");
    if (!/^[0-9a-f]{40}$/.test(registry.subjectTree ?? "")) errors.push("evidence subjectTree must be a 40-character Git tree SHA");
    if (!/^sha256:[0-9a-f]{64}$/.test(registry.sourceDigest ?? "")) errors.push("evidence sourceDigest must be SHA-256");
    if (!registry.scenarioVersion || typeof registry.scenarioVersion !== "string") errors.push("evidence scenarioVersion is required");
    if (!registry.generatedAt || Number.isNaN(Date.parse(registry.generatedAt))) errors.push("evidence generatedAt must be an ISO date-time");
    if (registry.workflowRunId !== null && typeof registry.workflowRunId !== "string") errors.push("workflowRunId must be a string or null");
    if (registry.workflowRunAttempt !== null && typeof registry.workflowRunAttempt !== "string") errors.push("workflowRunAttempt must be a string or null");
    if (!["LOCAL_UNATTESTED", "GITHUB_ATTESTATION_PENDING"].includes(registry.provenance?.mode)) errors.push("evidence provenance mode is invalid");
    if (registry.provenance?.repository !== "quanngynx/servexa-warranty-ai") errors.push("evidence provenance repository is invalid");
    if (!validateHistoricalGitSubject(repoRoot, registry.subjectCommit, registry.subjectTree)) {
      errors.push("evidence Git subject commit/tree is unavailable or inconsistent");
    }
    const sourceScope = await getP0aEvidenceScope(repoRoot);
    if (registry.sourceDigest !== sourceScope.digest) errors.push("evidence sourceDigest is stale");
    if (registry.sourceScope?.id !== sourceScope.scopeId || registry.sourceScope?.version !== sourceScope.scopeVersion || registry.sourceScope?.manifest !== sourceScope.manifest || registry.sourceScope?.fileCount !== sourceScope.files.length) {
      errors.push("evidence sourceScope metadata is stale or invalid");
    }
    try {
      assertEvidenceScopeMatchesGitSubject(repoRoot, sourceScope, registry.subjectCommit);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "evidence source is not bound to Git subject");
    }
    const recordList = Array.isArray(registry.records) ? registry.records : [];
    const records = new Map(recordList.map((record) => [record.proofId, record]));
    if (records.size !== recordList.length) errors.push("evidence proofId values must be unique");
    allPassed = [...REQUIRED_GROUPS].every((id) => records.get(id)?.status === "PASSED");
    for (const id of REQUIRED_GROUPS) {
      const record = records.get(id);
      if (!record) {
        errors.push(`missing evidence record: ${id}`);
        continue;
      }
      if (record.status !== "PASSED") errors.push(`proof did not pass: ${id}`);
      if (record.status === "FAILED" && !record.reason) errors.push(`failed proof ${id} requires a reason`);
      if (!record.toolVersions || Object.keys(record.toolVersions).length === 0) errors.push(`proof ${id} requires tool versions`);
      if (!record.imageVersions || Object.keys(record.imageVersions).length === 0) errors.push(`proof ${id} requires image versions`);
      if (!Array.isArray(record.artifacts) || record.artifacts.length === 0) {
        errors.push(`proof ${id} requires artifacts`);
        continue;
      }
      for (const artifact of record.artifacts) {
        const absolute = path.resolve(repoRoot, artifact.path);
        if (!absolute.startsWith(`${path.join(repoRoot, ".p0a", "evidence")}${path.sep}`)) {
          errors.push(`proof artifact must stay under .p0a/evidence: ${artifact.path}`);
          continue;
        }
        try {
          if (await sha256(absolute) !== artifact.sha256) errors.push(`artifact checksum mismatch: ${artifact.path}`);
        } catch {
          errors.push(`missing proof artifact: ${artifact.path}`);
        }
      }
    }
  } catch (error) {
    if (requireReady) {
      errors.push(`cannot validate evidence registry: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (registryData) {
    for (const role of ["Engineering", "Security"]) {
      const signoff = signoffs.get(role);
      if (signoff?.status !== "APPROVED" || !signoff.evidence) continue;
      errors.push(...await validateApprovedAttestation({
        repoRoot,
        gate,
        signoff,
        evidencePath: path.resolve(repoRoot, signoff.evidence),
        expectedRegistry: registryData,
        expectedRegistryPath: gate.evidenceRegistry,
      }));
    }
  }

  const approvalsComplete = ["Engineering", "Security"].every((role) => {
    const signoff = signoffs.get(role);
    return signoff?.status === "APPROVED" && signoff.approver && signoff.evidence;
  });
  if (approvalsComplete && allowedSignerKeyMaterial(process.env.ENGINEERING_ALLOWED_SIGNERS) === allowedSignerKeyMaterial(process.env.SECURITY_ALLOWED_SIGNERS)) {
    errors.push("Engineering and Security must use different OpenSSH signers");
  }
  if (gate.status === "CLOSED") {
    const result = verifyGithubEvidenceAttestation(path.join(repoRoot, ".p0a", "evidence", "bundle.json"), "quanngynx/servexa-warranty-ai/.github/workflows/p0a-reference-readiness.yml");
    if (!result.verified) errors.push(`CLOSED P0A requires GitHub OIDC verified evidence provenance: ${result.reason}`);
  }
  if (registryAvailable || requireReady) {
    const expectedStatus = allPassed ? (approvalsComplete ? "CLOSED" : "READY_FOR_SIGN_OFF") : "IN_PROGRESS";
    if (gate.status !== expectedStatus) errors.push(`manifest status must be ${expectedStatus} for current evidence/sign-offs`);
    if (gate.nextReferencePhaseAllowed !== (expectedStatus === "CLOSED")) {
      errors.push("nextReferencePhaseAllowed is true only for CLOSED P0A");
    }
  } else if (gate.status === "CLOSED") {
    errors.push("CLOSED P0A must be validated with its evidence registry");
  }
  if (requireReady && !allPassed) errors.push("all seven proof groups must pass");
  if (requireReady && !["READY_FOR_SIGN_OFF", "CLOSED"].includes(gate.status)) errors.push("P0A is not ready for sign-off");

  if (errors.length) return fail(errors);
  console.log(`P0A manifest valid: ${gate.status}`);
  console.log(`Technical evidence: ${allPassed ? "complete" : "not complete"}`);
  console.log("P0B remains BLOCKED; production progression is not authorized.");
}

await main();
