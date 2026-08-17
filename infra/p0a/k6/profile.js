export const P0A_CAPACITY_SCENARIO_VERSION = "p0a-capacity-v2";

const SHARED_LIMITS = Object.freeze({
  thinkTimeSeconds: 1,
  requestTimeout: "3s",
  commandTimeoutMs: 180_000,
});

const PROFILES = Object.freeze({
  baseline: Object.freeze({ vus: 10, duration: "60s" }),
  peak: Object.freeze({ vus: 20, duration: "60s" }),
});

function durationSeconds(duration) {
  const match = /^(\d+)s$/.exec(duration);
  if (!match) throw new Error(`Unsupported P0A capacity duration: ${duration}`);
  return Number(match[1]);
}

export function getP0aCapacityRun(name) {
  const selected = PROFILES[name];
  if (!selected) throw new Error(`Unknown P0A capacity profile: ${name}`);
  const seconds = durationSeconds(selected.duration);
  return Object.freeze({
    name,
    ...selected,
    ...SHARED_LIMITS,
    estimatedMaxIterations: selected.vus * Math.ceil(seconds / SHARED_LIMITS.thinkTimeSeconds),
  });
}
