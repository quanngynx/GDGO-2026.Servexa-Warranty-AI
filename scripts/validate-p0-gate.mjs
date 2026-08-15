import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(
  repoRoot,
  "documents",
  "production-readiness",
  "p0-gate.json",
);
const requireClosed = process.argv.includes("--require-closed");

const REQUIRED_PREREQUISITES = new Set([
  "target-enterprise",
  "external-system",
  "production-connector",
  "deployment-target",
  "identity-provider",
  "ai-provider",
  "production-topology-proof",
  "capacity-baseline",
]);
const REQUIRED_SIGNOFFS = new Set([
  "Business",
  "Security",
  "Engineering",
  "Operations",
]);
const PHASE_STATUSES = new Set([
  "BLOCKED",
  "IN_PROGRESS",
  "READY_FOR_SIGN_OFF",
  "CLOSED",
]);
const PREREQUISITE_STATUSES = new Set(["OPEN", "SELECTED", "VERIFIED"]);
const SIGNOFF_STATUSES = new Set(["PENDING", "APPROVED", "REJECTED"]);

function fail(errors) {
  for (const error of errors) console.error(`P0 gate error: ${error}`);
  process.exitCode = 1;
}

async function main() {
  const errors = [];
  let manifest;

  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    fail([`cannot read ${path.relative(repoRoot, manifestPath)}: ${error.message}`]);
    return;
  }

  if (manifest.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (manifest.phase !== "P0") errors.push("phase must be P0");
  if (!PHASE_STATUSES.has(manifest.status)) {
    errors.push(`unsupported phase status: ${String(manifest.status)}`);
  }
  if (typeof manifest.nextPhaseAllowed !== "boolean") {
    errors.push("nextPhaseAllowed must be boolean");
  }

  const prerequisites = Array.isArray(manifest.prerequisites)
    ? manifest.prerequisites
    : [];
  const prerequisiteIds = new Set(prerequisites.map((item) => item.id));
  for (const id of REQUIRED_PREREQUISITES) {
    if (!prerequisiteIds.has(id)) errors.push(`missing prerequisite: ${id}`);
  }
  for (const item of prerequisites) {
    if (!PREREQUISITE_STATUSES.has(item.status)) {
      errors.push(`unsupported prerequisite status for ${item.id}: ${item.status}`);
    }
    if (!Array.isArray(item.evidence)) {
      errors.push(`prerequisite ${item.id} evidence must be an array`);
    }
    if (item.status === "VERIFIED" && item.evidence?.length === 0) {
      errors.push(`verified prerequisite ${item.id} requires evidence`);
    }
  }

  const signoffs = Array.isArray(manifest.signoffs) ? manifest.signoffs : [];
  const signoffRoles = new Set(signoffs.map((item) => item.role));
  for (const role of REQUIRED_SIGNOFFS) {
    if (!signoffRoles.has(role)) errors.push(`missing sign-off role: ${role}`);
  }
  for (const item of signoffs) {
    if (!SIGNOFF_STATUSES.has(item.status)) {
      errors.push(`unsupported sign-off status for ${item.role}: ${item.status}`);
    }
    if (item.status === "APPROVED" && (!item.approver || !item.evidence)) {
      errors.push(`approved sign-off ${item.role} requires approver and evidence`);
    }
  }

  const artifacts = Array.isArray(manifest.artifacts) ? manifest.artifacts : [];
  if (artifacts.length === 0) errors.push("artifacts must not be empty");
  for (const artifact of artifacts) {
    const absolute = path.resolve(repoRoot, artifact);
    if (!absolute.startsWith(`${repoRoot}${path.sep}`)) {
      errors.push(`artifact escapes repository: ${artifact}`);
      continue;
    }
    try {
      const info = await stat(absolute);
      if (!info.isFile()) errors.push(`artifact is not a file: ${artifact}`);
    } catch {
      errors.push(`missing artifact: ${artifact}`);
    }
  }

  const allVerified = [...REQUIRED_PREREQUISITES].every((id) =>
    prerequisites.some((item) => item.id === id && item.status === "VERIFIED"),
  );
  const allApproved = [...REQUIRED_SIGNOFFS].every((role) =>
    signoffs.some(
      (item) =>
        item.role === role &&
        item.status === "APPROVED" &&
        item.approver &&
        item.evidence,
    ),
  );
  const gateClosed = allVerified && allApproved;

  if (manifest.nextPhaseAllowed !== gateClosed) {
    errors.push("nextPhaseAllowed must equal verified prerequisites plus approved sign-offs");
  }
  if ((manifest.status === "CLOSED") !== gateClosed) {
    errors.push("status CLOSED must exactly match a fully evidenced and approved gate");
  }

  if (errors.length > 0) {
    fail(errors);
    return;
  }

  const openPrerequisites = prerequisites
    .filter((item) => item.status !== "VERIFIED")
    .map((item) => item.id);
  const openSignoffs = signoffs
    .filter((item) => item.status !== "APPROVED")
    .map((item) => item.role);

  console.log(`P0 manifest valid: ${manifest.status}`);
  console.log(`Open prerequisites: ${openPrerequisites.join(", ") || "none"}`);
  console.log(`Open sign-offs: ${openSignoffs.join(", ") || "none"}`);

  if (requireClosed && !gateClosed) {
    console.error("P0 release gate is not closed; P1 production work is not authorized.");
    process.exitCode = 1;
  }
}

await main();

