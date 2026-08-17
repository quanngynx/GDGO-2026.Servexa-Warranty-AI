import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getP1rEvidenceScope } from "./p1r-source-digest.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readinessRoot = path.join(repoRoot, "documents", "production-readiness");
const action = process.argv[2] ?? "check";

async function gate(name) {
  return JSON.parse(await readFile(path.join(readinessRoot, name), "utf8"));
}

async function prerequisiteState() {
  const [p0a, p1d, p1r] = await Promise.all([
    gate("p0a-gate.json"),
    gate("p1d-gate.json"),
    gate("p1r-gate.json"),
  ]);
  const blockers = [];
  if (p0a.status !== "CLOSED") blockers.push(`P0A=${p0a.status} (requires CLOSED)`);
  if (p1d.status !== "CLOSED") blockers.push(`P1D=${p1d.status} (requires CLOSED)`);
  if (p0a.status === "CLOSED" && p1d.status === "CLOSED") {
    for (const [label, args] of [
      ["P0A", ["scripts/validate-p0a-gate.mjs", "--require-ready"]],
      ["P1D", ["scripts/validate-p1-gates.mjs", "--require-p1d-ready"]],
    ]) {
      const verification = spawnSync(process.execPath, args, { cwd: repoRoot, encoding: "utf8" });
      if (verification.status !== 0) blockers.push(`${label} closure cryptographic verification failed`);
    }
  }
  if (p1r.runtimeImplementationAllowed !== true) blockers.push("P1R runtimeImplementationAllowed=false");
  return { p0a, p1d, p1r, blockers };
}

function deny(actionName, blockers) {
  throw new Error(`P1R ${actionName} denied by machine prerequisites: ${blockers.join("; ")}`);
}

const state = await prerequisiteState();
const scope = await getP1rEvidenceScope(repoRoot);

switch (action) {
  case "check":
  case "preflight": {
    console.log(`P1R gate: ${state.p1r.status}`);
    console.log(`P1R evidence scope: ${scope.scopeId}@${scope.scopeVersion} (${scope.files.length} files)`);
    if (state.blockers.length) console.log(`P1R blockers: ${state.blockers.join("; ")}`);
    break;
  }
  case "up":
  case "proof": {
    if (state.blockers.length) deny(action, state.blockers);
    const composePath = path.join(repoRoot, "docker-compose.p1r.yml");
    try {
      if (!(await stat(composePath)).isFile()) throw new Error("not a file");
    } catch {
      throw new Error("P1R runtime prerequisites are closed, but docker-compose.p1r.yml is not implemented");
    }
    throw new Error(`P1R ${action} runtime implementation is not present in the pre-runtime guardrail`);
  }
  case "gate": {
    if (state.p1r.status !== "READY_FOR_SIGN_OFF" && state.p1r.status !== "CLOSED") {
      deny("gate", state.blockers.length ? state.blockers : [`status=${state.p1r.status}`]);
    }
    console.log(`P1R gate eligible for validation: ${state.p1r.status}`);
    break;
  }
  default:
    throw new Error(`Unknown P1R action: ${action}`);
}
