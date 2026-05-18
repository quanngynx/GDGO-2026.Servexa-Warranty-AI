import { Router, type IRouter } from "express";

import { authenticateMiddleware } from "@/middlewares/authenticate.middleware";
import {
  requirePermissions,
  resolvePermissions,
} from "@/middlewares/require-permission.middleware";
import { HITL_CREATE_ANY_PERMISSIONS } from "@/modules/v1/ai/hitl/hitl-permissions";

import hitlController from "@/modules/v1/ai/controllers/hitl.controller";

const hitlRoute: IRouter = Router();

hitlRoute.use(authenticateMiddleware, resolvePermissions);

hitlRoute.post(
  "/requests",
  requirePermissions(HITL_CREATE_ANY_PERMISSIONS, { mode: "any" }),
  hitlController.createRequest,
);
hitlRoute.get("/requests", hitlController.listRequests);
hitlRoute.get("/requests/:id", hitlController.getRequest);
hitlRoute.post("/requests/:id/decision", hitlController.submitDecision);
hitlRoute.post("/requests/:id/resume", hitlController.resumeGraph);

export default hitlRoute;
