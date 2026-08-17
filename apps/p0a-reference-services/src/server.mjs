import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

const MODES = new Set(["scim", "warranty", "ai"]);
const FAULTS = new Set([
  "none", "delay", "timeout", "ambiguous", "rate_limit", "unavailable",
  "duplicate", "reordered", "stale_version", "schema_mismatch", "webhook_replay",
]);
const RESTRICTED_KEYS = /customer(phone|email|name)|nationalid|address|raw(evidence|document)|secret/i;

function json(res, status, body, headers = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    ...headers,
  });
  res.end(payload);
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) throw new Error("payload too large");
  }
  return raw ? JSON.parse(raw) : {};
}

function initialState() {
  return {
    fault: "none",
    requests: 0,
    rejectedSensitiveRequests: 0,
    users: new Map(),
    groups: new Map(),
    executions: new Map(),
    idempotency: new Map(),
    statusPolls: new Map(),
    webhookEvents: new Set(),
  };
}

function scimResource(body, id = randomUUID()) {
  return {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    id,
    userName: body.userName,
    active: body.active ?? true,
    displayName: body.displayName ?? body.name?.formatted ?? body.userName,
    groups: body.groups ?? [],
    meta: { resourceType: "User", version: `W/\"${id}\"` },
  };
}

function enterpriseError(code, message, correlationId, retryable = false) {
  return { ok: false, error: { code, message, retryable, correlationId } };
}

async function emitSyntheticSpan(mode, traceparent, correlationId) {
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!endpoint || !traceparent) return;
  const traceId = traceparent.split("-")[1];
  if (!/^[0-9a-f]{32}$/i.test(traceId ?? "")) return;
  const started = BigInt(Date.now()) * 1_000_000n;
  const response = await fetch(`${endpoint.replace(/\/$/, "")}/v1/traces`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ resourceSpans: [{
      resource: { attributes: [{ key: "service.name", value: { stringValue: `servexa-${mode}-reference-p0a` } }] },
      scopeSpans: [{ scope: { name: "p0a-proof" }, spans: [{
        traceId, spanId: randomUUID().replaceAll("-", "").slice(0, 16), name: `${mode}-reference-p0a-proof`, kind: 2,
        startTimeUnixNano: String(started), endTimeUnixNano: String(started + 1_000_000n), status: { code: 1 },
        attributes: [{ key: "correlation.id", value: { stringValue: correlationId } }],
      }] }],
    }] }),
  });
  if (!response.ok) throw new Error(`reference OTLP export failed: ${response.status}`);
}

export function createReferenceServer(options = {}) {
  const mode = options.mode ?? process.env.P0A_SERVICE_MODE ?? "warranty";
  if (!MODES.has(mode)) throw new Error(`Unsupported P0A_SERVICE_MODE: ${mode}`);
  const controlToken = options.controlToken ?? process.env.P0A_CONTROL_TOKEN ?? "p0a-local-control";
  let state = initialState();

  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://p0a.invalid");
    const correlationId = String(req.headers["x-correlation-id"] ?? req.headers["x-request-id"] ?? randomUUID());
    const traceparent = typeof req.headers.traceparent === "string" ? req.headers.traceparent : undefined;
    const responseHeaders = { "x-correlation-id": correlationId, ...(traceparent ? { traceparent } : {}) };
    state.requests += 1;

    if (url.pathname === "/health") return json(res, 200, { status: "ok", mode }, responseHeaders);
    if (url.pathname === "/ready") return json(res, state.fault === "unavailable" ? 503 : 200, { status: state.fault === "unavailable" ? "degraded" : "ready", mode }, responseHeaders);
    if (url.pathname === "/metrics") {
      const payload = [
        "# TYPE p0a_reference_requests_total counter",
        `p0a_reference_requests_total{mode=\"${mode}\"} ${state.requests}`,
        "# TYPE p0a_reference_sensitive_rejections_total counter",
        `p0a_reference_sensitive_rejections_total{mode=\"${mode}\"} ${state.rejectedSensitiveRequests}`,
        "",
      ].join("\n");
      res.writeHead(200, { "content-type": "text/plain; version=0.0.4", ...responseHeaders });
      return res.end(payload);
    }

    if (url.pathname.startsWith("/__control/")) {
      if (req.headers["x-p0a-control-token"] !== controlToken) {
        return json(res, 403, enterpriseError("UNAUTHORIZED", "proof-control token required", correlationId), responseHeaders);
      }
      if (req.method === "POST" && url.pathname === "/__control/reset") {
        state = initialState();
        return json(res, 200, { reset: true, mode }, responseHeaders);
      }
      if (req.method === "POST" && url.pathname === "/__control/fault") {
        const body = await readJson(req);
        if (!FAULTS.has(body.fault)) return json(res, 400, { error: "unsupported fault" }, responseHeaders);
        state.fault = body.fault;
        return json(res, 200, { fault: state.fault }, responseHeaders);
      }
    }

    if (state.fault === "delay") await new Promise((resolve) => setTimeout(resolve, 250));
    if (state.fault === "timeout") await new Promise((resolve) => setTimeout(resolve, 5_000));
    if (state.fault === "rate_limit") return json(res, 429, enterpriseError("RATE_LIMITED", "synthetic quota exceeded", correlationId, true), responseHeaders);
    if (state.fault === "unavailable") return json(res, 503, enterpriseError("UNAVAILABLE", "synthetic provider unavailable", correlationId, true), responseHeaders);
    if (state.fault === "schema_mismatch") return json(res, 200, { unexpected: true }, responseHeaders);

    try {
      await emitSyntheticSpan(mode, traceparent, correlationId);
      if (mode === "scim") return await handleScim(req, res, url, state, responseHeaders);
      if (mode === "warranty") return await handleWarranty(req, res, url, state, correlationId, responseHeaders);
      return await handleAi(req, res, url, state, correlationId, responseHeaders);
    } catch (error) {
      return json(res, 400, enterpriseError("SCHEMA_MISMATCH", error instanceof Error ? error.message : "invalid request", correlationId), responseHeaders);
    }
  });
}

async function handleScim(req, res, url, state, headers) {
  if (req.method === "GET" && url.pathname === "/scim/v2/Users") {
    return json(res, 200, { schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"], totalResults: state.users.size, Resources: [...state.users.values()] }, headers);
  }
  if (req.method === "POST" && url.pathname === "/scim/v2/Users") {
    const body = await readJson(req);
    if (!body.userName) throw new Error("userName is required");
    const user = scimResource(body);
    state.users.set(user.id, user);
    return json(res, 201, user, { location: `/scim/v2/Users/${user.id}`, ...headers });
  }
  const userMatch = url.pathname.match(/^\/scim\/v2\/Users\/([^/]+)$/);
  if (userMatch && ["PUT", "PATCH"].includes(req.method ?? "")) {
    const current = state.users.get(userMatch[1]);
    if (!current) return json(res, 404, { detail: "user not found" }, headers);
    const body = await readJson(req);
    const replacement = { ...current, ...body, id: current.id };
    if (Array.isArray(body.Operations)) {
      for (const operation of body.Operations) {
        const operationPath = String(operation.path).toLowerCase();
        if (operationPath === "active") replacement.active = Boolean(operation.value);
        if (operationPath === "groups") replacement.groups = Array.isArray(operation.value) ? operation.value : [];
      }
    }
    state.users.set(current.id, replacement);
    return json(res, 200, replacement, headers);
  }
  if (req.method === "GET" && url.pathname === "/scim/v2/Groups") {
    return json(res, 200, { schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"], totalResults: state.groups.size, Resources: [...state.groups.values()] }, headers);
  }
  if (req.method === "POST" && url.pathname === "/scim/v2/Groups") {
    const body = await readJson(req);
    if (!body.displayName) throw new Error("displayName is required");
    const group = { schemas: ["urn:ietf:params:scim:schemas:core:2.0:Group"], id: randomUUID(), displayName: body.displayName, members: body.members ?? [] };
    state.groups.set(group.id, group);
    return json(res, 201, group, headers);
  }
  return json(res, 404, { detail: "SCIM route not found" }, headers);
}

async function handleWarranty(req, res, url, state, correlationId, headers) {
  const caseMatch = url.pathname.match(/^\/v1\/cases\/([^/]+)$/);
  if (req.method === "GET" && caseMatch) {
    const externalCaseId = decodeURIComponent(caseMatch[1]);
    if (externalCaseId === "missing") return json(res, 404, enterpriseError("NOT_FOUND", "case not found", correlationId), headers);
    return json(res, 200, {
      externalCaseId, version: state.fault === "stale_version" ? "v0" : "v1",
      ascId: "ASC-HCM-01", status: "OPEN", productCode: "SYNTHETIC-PRODUCT-1",
      policyVersion: "policy-v1", updatedAt: "2026-01-01T00:00:00.000Z",
    }, headers);
  }
  if (req.method === "POST" && url.pathname === "/v1/warranty-decisions/executions") {
    const body = await readJson(req);
    for (const field of ["workflowId", "decisionVersion", "externalCaseId", "expectedCaseVersion", "outcome", "decidedBy", "trace"]) {
      if (body[field] === undefined) throw new Error(`${field} is required`);
    }
    if (body.expectedCaseVersion !== "v1" || state.fault === "stale_version") {
      return json(res, 409, enterpriseError("CONFLICT", "external case version is stale", correlationId), headers);
    }
    const idempotencyKey = `${body.workflowId}:${body.decisionVersion}`;
    if (req.headers["idempotency-key"] && req.headers["idempotency-key"] !== idempotencyKey) {
      return json(res, 409, enterpriseError("CONFLICT", "idempotency key does not match workflow decision version", correlationId), headers);
    }
    const existing = state.idempotency.get(idempotencyKey);
    if (existing) return json(res, 200, existing, { "x-idempotent-replay": "true", ...headers });
    const receipt = {
      externalExecutionId: randomUUID(), idempotencyKey,
      status: state.fault === "ambiguous" ? "UNKNOWN" : "ACCEPTED",
      ...(state.fault === "duplicate" ? { syntheticDeliveries: 2 } : {}),
    };
    state.idempotency.set(idempotencyKey, receipt);
    state.executions.set(receipt.externalExecutionId, receipt);
    return json(res, state.fault === "ambiguous" ? 202 : 200, receipt, {
      ...(state.fault === "duplicate" ? { "x-p0a-duplicate-delivery": "true" } : {}),
      ...headers,
    });
  }
  const statusMatch = url.pathname.match(/^\/v1\/warranty-decisions\/executions\/([^/]+)$/);
  if (req.method === "GET" && statusMatch) {
    const receipt = state.executions.get(statusMatch[1]);
    if (!receipt) return json(res, 404, enterpriseError("NOT_FOUND", "execution not found", correlationId), headers);
    const polls = (state.statusPolls.get(receipt.externalExecutionId) ?? 0) + 1;
    state.statusPolls.set(receipt.externalExecutionId, polls);
    if (state.fault === "reordered" && polls === 1) {
      return json(res, 200, { ...receipt, status: "ACCEPTED" }, { "x-p0a-reordered-response": "true", ...headers });
    }
    return json(res, 200, { ...receipt, status: "EXECUTED", externalCaseVersion: "v2", confirmedAt: new Date().toISOString() }, headers);
  }
  if (req.method === "POST" && url.pathname === "/v1/warranty-decisions/reconciliation") {
    const body = await readJson(req);
    const receipt = body.externalExecutionId ? state.executions.get(body.externalExecutionId) : state.idempotency.get(`${body.workflowId}:${body.decisionVersion}`);
    return json(res, 200, receipt ? { status: "MATCHED", externalCaseVersion: "v2" } : { status: "NOT_FOUND", details: "no synthetic execution" }, headers);
  }
  if (req.method === "POST" && url.pathname === "/v1/webhooks/execution") {
    const body = await readJson(req);
    const signature = req.headers["x-p0a-signature"];
    const expected = createHash("sha256").update(JSON.stringify(body) + (process.env.P0A_WEBHOOK_SECRET ?? "synthetic-webhook-secret")).digest("hex");
    if (signature !== expected) return json(res, 401, enterpriseError("UNAUTHORIZED", "invalid webhook signature", correlationId), headers);
    if (state.webhookEvents.has(body.eventId) || state.fault === "webhook_replay") return json(res, 409, enterpriseError("CONFLICT", "webhook replay", correlationId), headers);
    state.webhookEvents.add(body.eventId);
    return json(res, 202, { accepted: true }, headers);
  }
  return json(res, 404, enterpriseError("NOT_FOUND", "warranty route not found", correlationId), headers);
}

async function handleAi(req, res, url, state, correlationId, headers) {
  if (req.method !== "POST" || url.pathname !== "/v1/inference") {
    return json(res, 404, enterpriseError("NOT_FOUND", "AI route not found", correlationId), headers);
  }
  const body = await readJson(req);
  const keys = Object.keys(body);
  if (keys.some((key) => RESTRICTED_KEYS.test(key)) || JSON.stringify(body.dataClasses ?? []).includes("RESTRICTED")) {
    state.rejectedSensitiveRequests += 1;
    return json(res, 422, enterpriseError("SCHEMA_MISMATCH", "restricted data is prohibited", correlationId), headers);
  }
  if (!body.requestId || !body.task || !body.sanitizedInput || !body.trace) throw new Error("sanitized AI contract is required");
  const result = body.task === "EMBED"
    ? { requestId: body.requestId, embedding: [0.1, 0.2, 0.3], retained: false, trainedOnInput: false }
    : { requestId: body.requestId, output: "synthetic recommendation", retained: false, trainedOnInput: false };
  return json(res, 200, result, headers);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const port = Number(process.env.PORT ?? 4100);
  createReferenceServer().listen(port, "0.0.0.0", () => {
    console.log(`P0A reference service mode=${process.env.P0A_SERVICE_MODE ?? "warranty"} port=${port}`);
  });
}
