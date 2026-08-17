import http from "k6/http";
import { check } from "k6";
import { Rate, Trend } from "k6/metrics";
import { sleep } from "k6";

import { getP0aCapacityRun } from "./profile.js";

const unexpected = new Rate("p0a_unexpected_status");
const workflowLatency = new Trend("p0a_workflow_latency", true);
const profile = getP0aCapacityRun(__ENV.P0A_K6_PROFILE || "baseline");
const vus = Number(__ENV.P0A_K6_VUS || profile.vus);
const duration = __ENV.P0A_K6_DURATION || profile.duration;
const thinkTimeSeconds = Number(__ENV.P0A_K6_THINK_TIME_SECONDS || profile.thinkTimeSeconds);
const requestTimeout = __ENV.P0A_K6_REQUEST_TIMEOUT || profile.requestTimeout;

export const options = {
  vus,
  duration,
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1500"],
    dropped_iterations: ["count==0"],
    p0a_unexpected_status: ["rate==0"],
    p0a_workflow_latency: ["p(95)<1500"],
  },
};

export default function () {
  const caseId = `load-${__VU}-${__ITER}`;
  const response = http.get(`${__ENV.P0A_WARRANTY_URL}/v1/cases/${caseId}`, {
    headers: { "x-correlation-id": `k6-${__VU}-${__ITER}` },
    timeout: requestTimeout,
  });
  workflowLatency.add(response.timings.duration);
  const ok = check(response, { "case context is valid": (r) => r.status === 200 && r.json("version") === "v1" });
  unexpected.add(!ok);
  sleep(thinkTimeSeconds);
}
