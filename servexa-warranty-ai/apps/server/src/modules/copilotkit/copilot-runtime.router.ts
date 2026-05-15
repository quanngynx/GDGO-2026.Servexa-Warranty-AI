import { CopilotRuntime, createCopilotExpressHandler } from "@copilotkit/runtime/v2";
import type { AbstractAgent } from "@ag-ui/client";
import type { IRouter } from "express";

import { SERVEXA_COPILOT_AGENT_ID, ServexaUnaryGatewayAgent } from "./servexa-unary-gateway.agent";

function createRuntime(): CopilotRuntime {
  const gatewayAgent = new ServexaUnaryGatewayAgent();

  return new CopilotRuntime({
    agents: {
      [SERVEXA_COPILOT_AGENT_ID]: gatewayAgent as unknown as AbstractAgent,
    },
  });
}

let cachedRuntime: CopilotRuntime | null = null;

function getRuntime(): CopilotRuntime {
  if (!cachedRuntime) {
    cachedRuntime = createRuntime();
  }
  return cachedRuntime;
}

/**
 * Express router: single-route CopilotKit endpoint (POST /api/copilotkit when mounted at app root).
 */
export function createCopilotKitRouter(): IRouter {
  return createCopilotExpressHandler({
    mode: "single-route",
    runtime: getRuntime(),
    basePath: "/api/copilotkit",
  });
}
