import assert from "node:assert/strict";
import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  P0A_CAPACITY_SCENARIO_VERSION,
  getP0aCapacityRun,
} from "../infra/p0a/k6/profile.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("P0A PostgreSQL initialization mounts the real vector SQL file", async () => {
  const compose = await readFile(path.join(rootDir, "docker-compose.p0a.yml"), "utf8");
  const initScript = path.join(rootDir, "packages", "db", "docker", "postgres", "init-vector.sql");
  const initScriptStat = await stat(initScript);

  assert.equal(initScriptStat.isFile(), true);
  assert.match(
    compose,
    /\.\/packages\/db\/docker\/postgres\/init-vector\.sql:\/docker-entrypoint-initdb\.d\/init-vector\.sql:ro/,
  );
});

test("P0A capacity profile preserves the approved VU matrix with bounded pacing", () => {
  assert.equal(P0A_CAPACITY_SCENARIO_VERSION, "p0a-capacity-v2");

  const baseline = getP0aCapacityRun("baseline");
  const peak = getP0aCapacityRun("peak");

  assert.deepEqual(
    { vus: baseline.vus, duration: baseline.duration },
    { vus: 10, duration: "60s" },
  );
  assert.deepEqual(
    { vus: peak.vus, duration: peak.duration },
    { vus: 20, duration: "60s" },
  );

  for (const run of [baseline, peak]) {
    assert.ok(run.thinkTimeSeconds >= 1, "closed-loop VUs must be paced");
    assert.equal(run.requestTimeout, "3s");
    assert.ok(run.commandTimeoutMs >= 120_000, "the Docker command timeout must include graceful shutdown headroom");
    assert.ok(run.estimatedMaxIterations <= run.vus * 61, "the fixed profile must not become an unbounded throughput test");
  }
});
