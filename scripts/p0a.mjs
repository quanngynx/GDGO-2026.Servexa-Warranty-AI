import { createHash, createPublicKey, generateKeyPairSync, randomBytes, sign } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getP0aCapacityRun } from "../infra/p0a/k6/profile.js";
import { getP0aEvidenceScope } from "./p0a-source-digest.mjs";
import { assertEvidenceScopeMatchesGitSubject } from "./evidence-scope.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runtimeDir = path.join(repoRoot, ".p0a");
const evidenceDir = path.join(runtimeDir, "evidence");
const envFile = path.join(runtimeDir, "runtime.env");
const evidencePrivateKeyFile = path.join(runtimeDir, "evidence-signing-private.pem");
const runtimeRealmFile = path.join(runtimeDir, "keycloak-realm.json");
const composeBase = ["compose", "--project-name", "servexa-p0a", "--env-file", envFile, "-f", "docker-compose.p0a.yml"];
const action = process.argv[2] ?? "check";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    env: { ...process.env, CI: process.env.CI ?? "true" },
    timeout: options.timeout,
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed (${result.status})\n${output}`);
  return output;
}

function dockerCompose(args, options = {}) {
  return run("docker", [...composeBase, ...args], options);
}

async function ensureRuntime() {
  await mkdir(evidenceDir, { recursive: true });
  const secret = (bytes = 24) => randomBytes(bytes).toString("base64url");
  try {
    await readFile(envFile, "utf8");
  } catch {
    await writeFile(envFile, [
      `P0A_POSTGRES_PASSWORD=${secret()}`,
      `P0A_REDIS_PASSWORD=${secret()}`,
      `P0A_MINIO_ACCESS_KEY=p0a${randomBytes(8).toString("hex")}`,
      `P0A_MINIO_SECRET_KEY=${secret(32)}`,
      `P0A_KEYCLOAK_ADMIN_PASSWORD=${secret()}`,
      `P0A_OPERATOR_PASSWORD=${secret()}`,
      `P0A_MANAGER_PASSWORD=${secret()}`,
      `P0A_SECURITY_PASSWORD=${secret()}`,
      `P0A_CONTROL_TOKEN=${secret()}`,
      `P0A_WEBHOOK_SECRET=${secret()}`,
      `P0A_TEMP_REFRESH_SECRET=${secret(48)}`,
      `P0A_PUBLIC_ROUTES_API_KEY=${secret()}`,
      "",
    ].join("\n"), { mode: 0o600 });
  }
  let environmentText = await readFile(envFile, "utf8");
  const existingNames = new Set(environmentText.trim().split(/\r?\n/).map((line) => line.split("=", 1)[0]));
  const missingSecrets = ["P0A_OPERATOR_PASSWORD", "P0A_MANAGER_PASSWORD", "P0A_SECURITY_PASSWORD"]
    .filter((name) => !existingNames.has(name))
    .map((name) => `${name}=${secret()}`);
  if (missingSecrets.length) {
    environmentText = `${environmentText.trimEnd()}\n${missingSecrets.join("\n")}\n`;
    await writeFile(envFile, environmentText, { mode: 0o600 });
  }
  try {
    await readFile(evidencePrivateKeyFile, "utf8");
  } catch {
    const { privateKey } = generateKeyPairSync("ed25519");
    await writeFile(evidencePrivateKeyFile, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 });
  }
  const runtimeEnvironment = Object.fromEntries(environmentText.trim().split(/\r?\n/).map((line) => line.split(/=(.*)/s).slice(0, 2)));
  let realm = await readFile(path.join(repoRoot, "infra", "p0a", "keycloak", "realm-servexa-p0a.json"), "utf8");
  for (const [placeholder, variable] of [
    ["__P0A_OPERATOR_PASSWORD__", "P0A_OPERATOR_PASSWORD"],
    ["__P0A_MANAGER_PASSWORD__", "P0A_MANAGER_PASSWORD"],
    ["__P0A_SECURITY_PASSWORD__", "P0A_SECURITY_PASSWORD"],
  ]) {
    const value = runtimeEnvironment[variable];
    if (!value) throw new Error(`Missing synthetic secret ${variable}; remove .p0a/runtime.env to regenerate it`);
    realm = realm.replaceAll(placeholder, value);
  }
  await writeFile(runtimeRealmFile, realm, { mode: 0o600 });
}

async function waitFor(url, timeoutMs = 180_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3_000) });
      if (response.ok) return;
      lastError = new Error(`${url} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError instanceof Error ? lastError.message : lastError}`);
}

function execNode(service, source) {
  return dockerCompose(["exec", "-T", service, "node", "--input-type=module", "-e", source], { capture: true });
}

async function up() {
  await ensureRuntime();
  dockerCompose(["up", "-d", "--build", "--remove-orphans"]);
  await Promise.all([
    waitFor("http://127.0.0.1:18000/_health"),
    waitFor("http://127.0.0.1:18080/realms/servexa-p0a/.well-known/openid-configuration"),
    waitFor("http://127.0.0.1:16686/"),
    waitFor("http://127.0.0.1:19090/-/ready"),
  ]);
}

async function proofContracts() {
  const first = run(process.execPath, [path.join(repoRoot, "node_modules", "vitest", "vitest.mjs"), "run", "src/index.test.ts"], {
    capture: true,
    cwd: path.join(repoRoot, "packages", "enterprise-contracts"),
  });
  const second = run(process.execPath, ["--test", "test/reference-services.test.mjs"], {
    capture: true,
    cwd: path.join(repoRoot, "apps", "p0a-reference-services"),
  });
  const faults = execNode("warranty-reference", `
    const base='http://127.0.0.1:4100';const control={'content-type':'application/json','x-p0a-control-token':process.env.P0A_CONTROL_TOKEN};
    const setFault=fault=>fetch(base+'/__control/fault',{method:'POST',headers:control,body:JSON.stringify({fault})});
    const results={};
    try{
      await setFault('delay');let started=Date.now();let response=await fetch(base+'/v1/cases/case-1');results.delayMs=Date.now()-started;if(!response.ok||results.delayMs<200)throw new Error('delay fault failed');
      await setFault('timeout');started=Date.now();try{await fetch(base+'/v1/cases/case-1',{signal:AbortSignal.timeout(250)});throw new Error('timeout fault failed')}catch(error){if(error.message==='timeout fault failed')throw error;results.timeoutAbortedMs=Date.now()-started}
      await setFault('rate_limit');response=await fetch(base+'/v1/cases/case-1');if(response.status!==429||(await response.json()).error.code!=='RATE_LIMITED')throw new Error('429 mapping failed');results.rateLimited=true;
      await setFault('unavailable');response=await fetch(base+'/v1/cases/case-1');if(response.status!==503||(await response.json()).error.code!=='UNAVAILABLE')throw new Error('5xx mapping failed');results.unavailable=true;
      await setFault('schema_mismatch');response=await fetch(base+'/v1/cases/case-1');if(!(await response.json()).unexpected)throw new Error('schema mismatch fault failed');results.schemaMismatch=true;
    }finally{await fetch(base+'/__control/reset',{method:'POST',headers:control})}
    console.log(JSON.stringify(results));
  `);
  return `${first}\n${second}\n${faults}`;
}

async function proofIdentity() {
  const oidc = await fetch("http://127.0.0.1:18080/realms/servexa-p0a/.well-known/openid-configuration").then((r) => r.json());
  if (!oidc.authorization_endpoint || !oidc.code_challenge_methods_supported?.includes("S256")) throw new Error("OIDC PKCE S256 is not advertised");
  const saml = await fetch("http://127.0.0.1:18080/realms/servexa-p0a/protocol/saml/descriptor").then((r) => r.text());
  if (!saml.includes("EntityDescriptor") || !saml.includes("KeyDescriptor")) throw new Error("signed SAML metadata is missing");
  const scimOutput = execNode("scim-reference", `
    const base='http://127.0.0.1:4100';
    const headers={'content-type':'application/json','x-correlation-id':'p0a-scim'};
    const groupResponse=await fetch(base+'/scim/v2/Groups',{method:'POST',headers,body:JSON.stringify({displayName:'ASC-HCM-01'})});
    if(groupResponse.status!==201) throw new Error('SCIM group create failed');
    const group=await groupResponse.json();
    const created=await fetch(base+'/scim/v2/Users',{method:'POST',headers,body:JSON.stringify({userName:'proof.operator',active:true,groups:[{value:'ASC-HCM-01'}]})});
    if(created.status!==201) throw new Error('SCIM create failed');
    const user=await created.json();
    const deactivated=await fetch(base+'/scim/v2/Users/'+user.id,{method:'PATCH',headers,body:JSON.stringify({Operations:[{op:'Replace',path:'groups',value:[{value:group.displayName}]},{op:'Replace',path:'active',value:false}]})});
    const updated=await deactivated.json();
    if(deactivated.status!==200 || updated.active!==false || updated.groups?.[0]?.value!=='ASC-HCM-01') throw new Error('SCIM group mapping/deprovision failed');
    console.log(JSON.stringify({scim:'create-update-deactivate',groupMapping:updated.groups}));
  `);
  const env = Object.fromEntries((await readFile(envFile, "utf8")).trim().split(/\r?\n/).map((line) => line.split(/=(.*)/s).slice(0, 2)));

  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const redirectUri = "http://127.0.0.1:8080/callback";
  const authUrl = new URL(oidc.authorization_endpoint);
  authUrl.search = new URLSearchParams({
    client_id: "servexa-p0a-web", response_type: "code", scope: "openid profile email",
    redirect_uri: redirectUri, state: "p0a-state", nonce: "p0a-nonce",
    code_challenge: challenge, code_challenge_method: "S256",
  }).toString();
  const loginPage = await fetch(authUrl, { redirect: "manual" });
  const loginHtml = await loginPage.text();
  const action = loginHtml.match(/<form[^>]+action="([^"]+)"[^>]*>/i)?.[1]?.replaceAll("&amp;", "&");
  if (!action) throw new Error("OIDC login form was not returned");
  const cookie = loginPage.headers.getSetCookie().map((value) => value.split(";", 1)[0]).join("; ");
  const login = await fetch(action, {
    method: "POST", redirect: "manual",
    headers: { "content-type": "application/x-www-form-urlencoded", cookie },
    body: new URLSearchParams({ username: "operator.p0a", password: env.P0A_OPERATOR_PASSWORD, credentialId: "" }),
  });
  const callback = new URL(login.headers.get("location") ?? "", redirectUri);
  const code = callback.searchParams.get("code");
  if (!code || callback.searchParams.get("state") !== "p0a-state") throw new Error("OIDC authorization code flow did not complete");
  const exchanged = await fetch(oidc.token_endpoint, {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: "servexa-p0a-web", grant_type: "authorization_code", code, redirect_uri: redirectUri, code_verifier: verifier }),
  });
  if (!exchanged.ok) throw new Error(`OIDC PKCE token exchange failed: ${exchanged.status}`);
  const oidcTokens = await exchanged.json();
  const idClaims = JSON.parse(Buffer.from(oidcTokens.id_token.split(".")[1], "base64url").toString("utf8"));
  if (!idClaims.groups?.includes("ASC-HCM-01") || !idClaims.asc_ids?.includes("ASC-HCM-01")) throw new Error("OIDC ASC/group claims are missing");

  const tokenResponse = await fetch("http://127.0.0.1:18080/realms/master/protocol/openid-connect/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: "admin-cli", grant_type: "password", username: "p0a-admin", password: env.P0A_KEYCLOAK_ADMIN_PASSWORD }),
  });
  if (!tokenResponse.ok) throw new Error(`Keycloak admin token failed: ${tokenResponse.status}`);
  const token = (await tokenResponse.json()).access_token;
  const users = await fetch("http://127.0.0.1:18080/admin/realms/servexa-p0a/users?username=manager.p0a&exact=true", { headers: { authorization: `Bearer ${token}` } }).then((r) => r.json());
  if (!users[0]?.requiredActions?.includes("CONFIGURE_TOTP")) throw new Error("manager MFA fixture is missing");
  const realm = await fetch("http://127.0.0.1:18080/admin/realms/servexa-p0a", { headers: { authorization: `Bearer ${token}` } }).then((r) => r.json());
  if (realm.otpPolicyType !== "totp" || realm.otpPolicyAlgorithm !== "HmacSHA256") throw new Error("TOTP policy fixture is missing");
  const clients = await fetch("http://127.0.0.1:18080/admin/realms/servexa-p0a/clients?clientId=servexa-p0a-saml", { headers: { authorization: `Bearer ${token}` } }).then((r) => r.json());
  if (clients[0]?.attributes?.["saml.assertion.signature"] !== "true" || clients[0]?.attributes?.["saml.server.signature"] !== "true") throw new Error("SAML signature path is not enabled");
  return JSON.stringify({ oidcPkce: "authorization-code-exchanged", ascClaims: idClaims.asc_ids, samlSignaturePath: true, managerMfaRequired: true, totpPolicy: realm.otpPolicyAlgorithm, scim: JSON.parse(scimOutput) }, null, 2);
}

async function proofAiDataHandling() {
  const restrictedMarker = `restricted-${randomBytes(12).toString("hex")}`;
  const providerResult = dockerCompose(["exec", "-T", "ai-api", "python", "-c", `
import json, urllib.request, urllib.error
def post(url, payload):
 request=urllib.request.Request(url,data=json.dumps(payload).encode(),headers={'content-type':'application/json','x-correlation-id':'p0a-ai'},method='POST')
 try:
  response=urllib.request.urlopen(request);return response.status,json.loads(response.read())
 except urllib.error.HTTPError as error:return error.code,json.loads(error.read())
denied_status,_=post('http://ai-reference:4100/v1/inference',{'requestId':'bad','task':'GENERATE','sanitizedInput':'x','dataClasses':['RESTRICTED'],'trace':{'correlationId':'p0a-ai'},'customerPhone':'${restrictedMarker}'})
assert denied_status==422,'restricted input was not rejected'
accepted_status,body=post('http://127.0.0.1:8081/v1/health/p0a-ai-data-proof',{'requestId':'ok','task':'GENERATE','sanitizedInput':'synthetic evidence','dataClasses':['INTERNAL'],'trace':{'correlationId':'p0a-ai'},'customerPhone':'${restrictedMarker}'})
assert accepted_status==200 and body['provider']['retained'] is False and body['provider']['trainedOnInput'] is False and 'customerPhone' in body['redactedFields'],'pre-provider redaction/zero-retention contract failed'
print(json.dumps({'restrictedRejected':True,'forbiddenFieldRemovedBeforeProvider':True,'redactedFields':body['redactedFields'],'retained':body['provider']['retained'],'trainedOnInput':body['provider']['trainedOnInput']}))
  `], { capture: true });
  const logs = dockerCompose(["logs", "--no-color", "ai-reference", "ai-api", "server"], { capture: true });
  const traces = await fetch("http://127.0.0.1:16686/api/traces?service=servexa-ai-reference-p0a&limit=20").then((response) => response.text());
  if (logs.includes(restrictedMarker) || traces.includes(restrictedMarker) || providerResult.includes(restrictedMarker)) throw new Error("restricted provider data leaked into logs, traces, or proof output");
  return JSON.stringify({ ...JSON.parse(providerResult), restrictedMarkerAbsentFromLogs: true, restrictedMarkerAbsentFromTraces: true, retainedArtifactContent: false }, null, 2);
}

async function proofTopology() {
  const psOutput = dockerCompose(["ps", "--format", "json"], { capture: true }).trim();
  const containers = psOutput.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  const running = containers.filter((container) => container.State === "running").map((container) => container.Service);
  const required = ["postgres", "redis", "minio", "scim-reference", "warranty-reference", "ai-reference", "keycloak", "ai-api", "ai-worker", "server", "web", "otel-collector", "jaeger", "prometheus"];
  const missing = required.filter((service) => !running.includes(service));
  if (missing.length) throw new Error(`services not running: ${missing.join(", ")}`);
  const internalServices = new Set(["postgres", "redis", "minio", "scim-reference", "warranty-reference", "ai-reference", "ai-api", "ai-worker", "server", "otel-collector"]);
  for (const container of containers.filter((item) => internalServices.has(item.Service))) {
    if ((container.Publishers ?? []).some((publisher) => publisher.PublishedPort > 0)) throw new Error(`internal service is host-published: ${container.Service}`);
  }
  for (const container of containers) {
    for (const publisher of container.Publishers ?? []) {
      if (publisher.PublishedPort > 0 && publisher.URL !== "127.0.0.1") throw new Error(`UI port is not loopback-bound: ${container.Service}`);
    }
  }
  const serverReady = execNode("server", `const r=await fetch('http://127.0.0.1:3000/ready');if(!r.ok)throw new Error(await r.text());console.log(await r.text())`);
  execNode("warranty-reference", `const headers={'content-type':'application/json','x-p0a-control-token':process.env.P0A_CONTROL_TOKEN};await fetch('http://127.0.0.1:4100/__control/fault',{method:'POST',headers,body:JSON.stringify({fault:'unavailable'})})`);
  try {
    execNode("server", `const r=await fetch('http://127.0.0.1:3000/ready');if(r.status!==503)throw new Error('Express readiness did not fail closed for dependency outage')`);
  } finally {
    execNode("warranty-reference", `const headers={'content-type':'application/json','x-p0a-control-token':process.env.P0A_CONTROL_TOKEN};await fetch('http://127.0.0.1:4100/__control/reset',{method:'POST',headers})`);
  }
  execNode("ai-reference", `const headers={'content-type':'application/json','x-p0a-control-token':process.env.P0A_CONTROL_TOKEN};await fetch('http://127.0.0.1:4100/__control/fault',{method:'POST',headers,body:JSON.stringify({fault:'unavailable'})})`);
  try {
    dockerCompose(["exec", "-T", "ai-api", "python", "-c", "import urllib.request, urllib.error;\ntry:\n urllib.request.urlopen('http://127.0.0.1:8081/v1/health/ready')\n raise SystemExit('FastAPI readiness did not degrade')\nexcept urllib.error.HTTPError as error:\n assert error.code == 503"]);
  } finally {
    execNode("ai-reference", `const headers={'content-type':'application/json','x-p0a-control-token':process.env.P0A_CONTROL_TOKEN};await fetch('http://127.0.0.1:4100/__control/reset',{method:'POST',headers})`);
  }
  const connectTargets = `const {connect}=await import('node:net');const names=JSON.parse(process.env.P0A_DISCOVERY_TARGETS);for(const target of names){const [host,port]=target.split(':');await new Promise((resolve,reject)=>{const socket=connect(Number(port),host,()=>{socket.end();resolve()});socket.on('error',reject)})};console.log(JSON.stringify({resolved:names}))`;
  const appDiscovery = dockerCompose(["exec", "-T", "-e", "P0A_DISCOVERY_TARGETS=[\"ai-reference:4100\"]", "warranty-reference", "node", "--input-type=module", "-e", connectTargets], { capture: true });
  const dataDiscovery = dockerCompose(["exec", "-T", "-e", "P0A_DISCOVERY_TARGETS=[\"postgres:5432\",\"redis:6379\"]", "server", "node", "--input-type=module", "-e", connectTargets], { capture: true });
  return JSON.stringify({ running, hostPublishedInternalServices: [], loopbackOnlyPublishedPorts: true, dependencyOutageReadiness: { express: 503, fastApi: 503 }, serviceDiscovery: { app: JSON.parse(appDiscovery), data: JSON.parse(dataDiscovery) }, serverReady: JSON.parse(serverReady) }, null, 2);
}

async function proofTelemetry() {
  const traceId = randomBytes(16).toString("hex");
  const traceparent = `00-${traceId}-${randomBytes(8).toString("hex")}-01`;
  const correlationId = `p0a-trace-${randomBytes(6).toString("hex")}`;
  const started = await fetch("http://127.0.0.1:18000/api/p0a/trace-proof", {
    method: "POST", headers: { traceparent, "x-correlation-id": correlationId },
  });
  if (started.status !== 202) throw new Error(`end-to-end trace trigger failed: ${started.status} ${await started.text()}`);
  const expectedServices = new Set(["servexa-server-p0a", "servexa-ai-p0a", "servexa-ai-worker-p0a", "servexa-ai-reference-p0a"]);
  let observedServices = new Set();
  let observedCorrelations = [];
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const traces = await fetch(`http://127.0.0.1:16686/api/traces/${traceId}`).then((r) => r.json());
    const trace = traces.data?.[0];
    observedServices = new Set((trace?.spans ?? []).map((span) => trace.processes?.[span.processID]?.serviceName).filter(Boolean));
    observedCorrelations = (trace?.spans ?? []).flatMap((span) => span.tags ?? []).filter((tag) => tag.key === "correlation.id").map((tag) => tag.value);
    if ([...expectedServices].every((service) => observedServices.has(service)) && observedCorrelations.length >= 4) break;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  for (const service of expectedServices) if (!observedServices.has(service)) throw new Error(`trace missing service: ${service}`);
  if (observedCorrelations.some((value) => value !== correlationId)) throw new Error("correlation ID diverged across trace spans");
  const metrics = await fetch("http://127.0.0.1:19090/api/v1/query?query=up%7Bjob%3D%22reference-services%22%7D").then((r) => r.json());
  if (!metrics.data?.result?.some((item) => item.value?.[1] === "1")) throw new Error("reference metrics not healthy in Prometheus");
  return JSON.stringify({ traceId, correlationId, services: [...observedServices].sort(), jaeger: true, prometheus: true }, null, 2);
}

async function proofBackupRestore() {
  const started = Date.now();
  dockerCompose(["exec", "-T", "postgres", "psql", "-U", "servexa_p0a", "-d", "servexa_p0a", "-v", "ON_ERROR_STOP=1", "-c", "create table if not exists p0a_recovery_marker(id int primary key, marker text); insert into p0a_recovery_marker values (1,'p0a-restored') on conflict (id) do update set marker=excluded.marker;"]);
  const pgBackRest = (...args) => dockerCompose(["exec", "-T", "--user", "postgres", "postgres", "pgbackrest", "--stanza=p0a", ...args]);
  try { pgBackRest("stanza-create"); } catch { pgBackRest("check"); }
  dockerCompose(["exec", "-T", "postgres", "psql", "-U", "servexa_p0a", "-d", "servexa_p0a", "-c", "select pg_switch_wal();"]);
  pgBackRest("--type=full", "backup");
  const info = dockerCompose(["exec", "-T", "--user", "postgres", "postgres", "pgbackrest", "--stanza=p0a", "--output=json", "info"], { capture: true });
  dockerCompose(["exec", "-T", "postgres", "psql", "-U", "servexa_p0a", "-d", "servexa_p0a", "-v", "ON_ERROR_STOP=1", "-c", "delete from p0a_recovery_marker where id=1;"]);
  const lost = dockerCompose(["exec", "-T", "postgres", "psql", "-U", "servexa_p0a", "-d", "servexa_p0a", "-Atc", "select count(*) from p0a_recovery_marker where id=1;"], { capture: true }).trim();
  if (lost !== "0") throw new Error("synthetic data-loss step did not remove the marker");
  const restoreStarted = Date.now();
  const restore = dockerCompose(["--profile", "proof", "run", "--rm", "postgres-restore-proof"], { capture: true });
  const measuredRtoMs = Date.now() - restoreStarted;
  return JSON.stringify({ syntheticOnly: true, productionTargetClaimed: false, durationMs: Date.now() - started, measuredRpoMs: 0, measuredRtoMs, dataLossSimulated: true, pgBackRestInfo: JSON.parse(info), restoreOutput: restore.trim() }, null, 2);
}

async function proofCapacity() {
  const runK6 = (name) => {
    const profile = getP0aCapacityRun(name);
    return dockerCompose([
      "--profile", "proof", "run", "--rm",
      "-e", `P0A_K6_PROFILE=${profile.name}`,
      "-e", `P0A_K6_VUS=${profile.vus}`,
      "-e", `P0A_K6_DURATION=${profile.duration}`,
      "-e", `P0A_K6_THINK_TIME_SECONDS=${profile.thinkTimeSeconds}`,
      "-e", `P0A_K6_REQUEST_TIMEOUT=${profile.requestTimeout}`,
      "k6", "run", "--quiet", "/scripts/p0a-load.js",
    ], { capture: true, timeout: profile.commandTimeoutMs });
  };
  const baseline = runK6("baseline");
  const peak = runK6("peak");
  const backlogStarted = Date.now();
  const backlog = execNode("server", `
    const Redis=(await import('ioredis')).default;
    const client=new Redis({host:'redis',port:6379,password:process.env.REDIS_PASSWORD,db:0});
    const traceparent='00-${randomBytes(16).toString("hex")}-${randomBytes(8).toString("hex")}-01';
    for(let index=0;index<20;index++)await client.xadd('p0a:trace','*','traceparent',traceparent,'correlationId','p0a-backlog-'+index);
    const deadline=Date.now()+60000;let remaining=await client.xlen('p0a:trace');
    while(remaining>0&&Date.now()<deadline){await new Promise(resolve=>setTimeout(resolve,250));remaining=await client.xlen('p0a:trace')}
    await client.quit();if(remaining!==0)throw new Error('synthetic backlog did not recover');console.log(JSON.stringify({enqueued:20,remaining}));
  `);
  const recoveryMs = Date.now() - backlogStarted;
  if (recoveryMs > 60_000) throw new Error(`backlog recovery exceeded 60s: ${recoveryMs}`);
  return `${JSON.stringify({ profile: "synthetic-only", recoveryMs, backlog: JSON.parse(backlog) })}\n--- baseline ---\n${baseline}\n--- peak-x2 ---\n${peak}`;
}

async function writeRegistry(results) {
  const files = [];
  for (const result of results) {
    const relative = `.p0a/evidence/${result.proofId}.log`;
    const absolute = path.join(repoRoot, relative);
    await writeFile(absolute, result.output, "utf8");
    const digest = createHash("sha256").update(await readFile(absolute)).digest("hex");
    files.push({ ...result, artifact: { path: relative.replaceAll("\\", "/"), sha256: digest } });
  }
  const composeImages = JSON.parse(dockerCompose(["images", "--format", "json"], { capture: true }));
  const imageVersions = Object.fromEntries(composeImages
    .map((item) => [item.Repository, item.ID])
    .sort(([left], [right]) => left.localeCompare(right)));
  const privateKey = await readFile(evidencePrivateKeyFile, "utf8");
  const publicKey = createPublicKey(privateKey).export({ type: "spki", format: "pem" });
  const trustedPublicKey = await readFile(path.join(repoRoot, "documents", "production-readiness", "trust", "p0a-evidence-ed25519-public.pem"), "utf8");
  if (publicKey !== trustedPublicKey) throw new Error("P0A evidence private key does not match the pinned trust key");
  const sourceScope = await getP0aEvidenceScope(repoRoot);
  const subjectCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim();
  assertEvidenceScopeMatchesGitSubject(repoRoot, sourceScope, subjectCommit);
  const registry = {
    schemaVersion: 1,
    subjectCommit,
    subjectTree: execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: repoRoot, encoding: "utf8" }).trim(),
    sourceDigest: sourceScope.digest,
    sourceScope: {
      id: sourceScope.scopeId,
      version: sourceScope.scopeVersion,
      manifest: sourceScope.manifest,
      fileCount: sourceScope.files.length,
    },
    workflowRunId: process.env.GITHUB_RUN_ID ?? null,
    workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
    generatedAt: new Date().toISOString(),
    scenarioVersion: "p0a-v2",
    records: files.map((result) => ({
      proofId: result.proofId,
      status: result.status,
      reason: result.reason ?? null,
      toolVersions: { node: process.version, docker: run("docker", ["--version"], { capture: true }).trim() },
      imageVersions,
      artifacts: [result.artifact],
    })),
  };
  registry.manifestSignature = {
    algorithm: "Ed25519",
    publicKey,
    value: sign(null, Buffer.from(JSON.stringify(registry)), privateKey).toString("base64"),
  };
  await writeFile(path.join(evidenceDir, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8");
}

async function runProofs(selected) {
  await ensureRuntime();
  const definitions = [
    ["contracts", proofContracts], ["identity", proofIdentity], ["ai-data-handling", proofAiDataHandling],
    ["topology-network", proofTopology], ["telemetry", proofTelemetry], ["backup-restore", proofBackupRestore],
    ["capacity-harness", proofCapacity],
  ].filter(([id]) => !selected || selected.includes(id));
  const results = [];
  for (const [proofId, proof] of definitions) {
    console.log(`\n[P0A] Running ${proofId}`);
    try {
      const output = await proof();
      results.push({ proofId, status: "PASSED", output: `${output}\n` });
      console.log(`[P0A] ${proofId}: PASSED`);
    } catch (error) {
      const reason = error instanceof Error ? error.stack ?? error.message : String(error);
      results.push({ proofId, status: "FAILED", reason, output: `${reason}\n` });
      console.error(`[P0A] ${proofId}: FAILED\n${reason}`);
    }
  }
  if (!selected) await writeRegistry(results);
  if (results.some((result) => result.status === "FAILED")) process.exitCode = 1;
}

async function assertFullProofSubject() {
  const sourceScope = await getP0aEvidenceScope(repoRoot);
  const subjectCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim();
  assertEvidenceScopeMatchesGitSubject(repoRoot, sourceScope, subjectCommit);
}

async function down() {
  await ensureRuntime();
  // COMPOSE_PROJECT_NAME is fixed above; this can only address P0A containers,
  // networks, and named volumes declared by docker-compose.p0a.yml.
  dockerCompose(["--profile", "proof", "down", "--remove-orphans", "--volumes"]);
}

switch (action) {
  case "up": await up(); break;
  case "smoke": await runProofs(["identity", "ai-data-handling", "topology-network", "telemetry"]); break;
  case "load": await runProofs(["capacity-harness"]); break;
  case "proof": await assertFullProofSubject(); await up(); await runProofs(); break;
  case "down": await down(); break;
  case "check": await ensureRuntime(); run(process.execPath, ["scripts/validate-p0a-gate.mjs"]); break;
  case "gate": run(process.execPath, ["scripts/validate-p0a-gate.mjs", "--require-ready"]); break;
  default: throw new Error(`Unknown P0A action: ${action}`);
}
