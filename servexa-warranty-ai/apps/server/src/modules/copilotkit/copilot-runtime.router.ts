import { CopilotRuntime, createCopilotExpressHandler } from "@copilotkit/runtime/v2";
import type { AbstractAgent } from "@ag-ui/client";
import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";

import { authenticateMiddleware } from "@/middlewares/authenticate.middleware";

import {
  getCopilotRequestUser,
  runWithCopilotUser,
} from "./copilot-request-context";
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

function wrapCopilotHandler(
  handler: IRouter,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    if (!req.user) {
      next();
      return;
    }
    runWithCopilotUser(
      {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        roleScope: req.user.roleScope,
        permissions: req.user.permissions ?? [],
      },
      () => handler(req, res, next),
    );
  };
}

/**
 * Express router: authenticated single-route CopilotKit endpoint (POST /api/copilotkit).
 */
export function createCopilotKitRouter(): IRouter {
  const copilotHandler = createCopilotExpressHandler({
    mode: "single-route",
    runtime: getRuntime(),
    basePath: "/api/copilotkit",
  });

  const router = Router();
  router.use(authenticateMiddleware);
  router.use(wrapCopilotHandler(copilotHandler));
  return router;
}

export { getCopilotRequestUser };
