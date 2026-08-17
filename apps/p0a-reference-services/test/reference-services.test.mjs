import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { after, before, test } from "node:test";
import { createReferenceServer } from "../src/server.mjs";

let server;
let baseUrl;

before(async () => {
  server = createReferenceServer({ mode: "warranty", controlToken: "test-control" });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

test("execution is idempotent and remains externally confirmed", async () => {
  const command = {
    workflowId: "wf-1", decisionVersion: 1, externalCaseId: "case-1",
    expectedCaseVersion: "v1", outcome: "ELIGIBLE", decidedBy: "manager-1",
    trace: { correlationId: "proof-1" },
  };
  const first = await fetch(`${baseUrl}/v1/warranty-decisions/executions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(command) });
  const firstBody = await first.json();
  const duplicate = await fetch(`${baseUrl}/v1/warranty-decisions/executions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(command) });
  assert.equal(duplicate.headers.get("x-idempotent-replay"), "true");
  assert.equal((await duplicate.json()).externalExecutionId, firstBody.externalExecutionId);
  const status = await fetch(`${baseUrl}/v1/warranty-decisions/executions/${firstBody.externalExecutionId}`);
  assert.equal((await status.json()).status, "EXECUTED");
});

test("stale external state produces a conflict, not a rejection", async () => {
  const response = await fetch(`${baseUrl}/v1/warranty-decisions/executions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ workflowId: "wf-2", decisionVersion: 1, externalCaseId: "case-1", expectedCaseVersion: "v0", outcome: "ELIGIBLE", decidedBy: "manager-1", trace: { correlationId: "proof-2" } }),
  });
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, "CONFLICT");
});

test("fault control is isolated by a token", async () => {
  const denied = await fetch(`${baseUrl}/__control/fault`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fault: "rate_limit" }) });
  assert.equal(denied.status, 403);
});

test("SCIM supports group mapping and deprovisioning", async () => {
  const scimServer = createReferenceServer({ mode: "scim", controlToken: "test-control" });
  await new Promise((resolve) => scimServer.listen(0, "127.0.0.1", resolve));
  const scimBase = `http://127.0.0.1:${scimServer.address().port}`;
  try {
    const created = await fetch(`${scimBase}/scim/v2/Users`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ userName: "operator", active: true }),
    });
    const user = await created.json();
    const updated = await fetch(`${scimBase}/scim/v2/Users/${user.id}`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({ Operations: [
        { op: "Replace", path: "groups", value: [{ value: "ASC-HCM-01" }] },
        { op: "Replace", path: "active", value: false },
      ] }),
    });
    const mapped = await updated.json();
    assert.deepEqual(mapped.groups, [{ value: "ASC-HCM-01" }]);
    assert.equal(mapped.active, false);
  } finally {
    await new Promise((resolve, reject) => scimServer.close((error) => error ? reject(error) : resolve()));
  }
});

test("fault controls cover rate limits, schema mismatch, duplicate and reordered responses", async () => {
  const headers = { "content-type": "application/json", "x-p0a-control-token": "test-control" };
  const setFault = (fault) => fetch(`${baseUrl}/__control/fault`, { method: "POST", headers, body: JSON.stringify({ fault }) });
  await setFault("rate_limit");
  const limited = await fetch(`${baseUrl}/v1/cases/case-1`);
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).error.code, "RATE_LIMITED");

  await setFault("schema_mismatch");
  const mismatch = await fetch(`${baseUrl}/v1/cases/case-1`);
  assert.deepEqual(await mismatch.json(), { unexpected: true });

  const command = {
    workflowId: "wf-fault", decisionVersion: 1, externalCaseId: "case-1",
    expectedCaseVersion: "v1", outcome: "ELIGIBLE", decidedBy: "manager-1",
    trace: { correlationId: "proof-fault" },
  };
  await setFault("duplicate");
  const duplicate = await fetch(`${baseUrl}/v1/warranty-decisions/executions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(command) });
  assert.equal(duplicate.headers.get("x-p0a-duplicate-delivery"), "true");
  const receipt = await duplicate.json();

  await setFault("reordered");
  const early = await fetch(`${baseUrl}/v1/warranty-decisions/executions/${receipt.externalExecutionId}`);
  assert.equal(early.headers.get("x-p0a-reordered-response"), "true");
  assert.equal((await early.json()).status, "ACCEPTED");
  assert.equal((await (await fetch(`${baseUrl}/v1/warranty-decisions/executions/${receipt.externalExecutionId}`)).json()).status, "EXECUTED");

  await setFault("none");
});

test("webhook signatures reject replay and ambiguous execution stays non-final", async () => {
  const event = { eventId: "event-1", externalExecutionId: "external-1", status: "EXECUTED" };
  const signature = createHash("sha256").update(JSON.stringify(event) + "synthetic-webhook-secret").digest("hex");
  const webhookHeaders = { "content-type": "application/json", "x-p0a-signature": signature };
  assert.equal((await fetch(`${baseUrl}/v1/webhooks/execution`, { method: "POST", headers: webhookHeaders, body: JSON.stringify(event) })).status, 202);
  const replay = await fetch(`${baseUrl}/v1/webhooks/execution`, { method: "POST", headers: webhookHeaders, body: JSON.stringify(event) });
  assert.equal(replay.status, 409);
  assert.equal((await replay.json()).error.code, "CONFLICT");

  await fetch(`${baseUrl}/__control/fault`, { method: "POST", headers: { "content-type": "application/json", "x-p0a-control-token": "test-control" }, body: JSON.stringify({ fault: "ambiguous" }) });
  const ambiguous = await fetch(`${baseUrl}/v1/warranty-decisions/executions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ workflowId: "wf-ambiguous", decisionVersion: 1, externalCaseId: "case-1", expectedCaseVersion: "v1", outcome: "ELIGIBLE", decidedBy: "manager-1", trace: { correlationId: "proof-ambiguous" } }),
  });
  assert.equal(ambiguous.status, 202);
  assert.equal((await ambiguous.json()).status, "UNKNOWN");
});
