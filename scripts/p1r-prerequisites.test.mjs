import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { getP1rEvidenceScope } from "./p1r-source-digest.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(action) {
  return spawnSync(process.execPath, ["scripts/p1r.mjs", action], { cwd: repoRoot, encoding: "utf8" });
}

test("P1R ownership scope resolves before runtime exists", async () => {
  const scope = await getP1rEvidenceScope(repoRoot);
  assert.equal(scope.scopeId, "P1R_SYNTHETIC_IDENTITY_AUTHORIZATION_REFERENCE");
  assert.ok(scope.files.includes("scripts/p1r.mjs"));
});

test("P1R preflight reports current blockers without starting runtime", () => {
  const result = run("preflight");
  assert.equal(result.status, 0);
  assert.match(result.stdout, /P1R gate: BLOCKED/);
  assert.match(result.stdout, /P0A=READY_FOR_SIGN_OFF/);
  assert.match(result.stdout, /P1D=READY_FOR_SIGN_OFF/);
});

for (const action of ["up", "proof", "gate"]) {
  test(`P1R ${action} fails closed while prerequisites are open`, () => {
    const result = run(action);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /denied by machine prerequisites/);
  });
}
