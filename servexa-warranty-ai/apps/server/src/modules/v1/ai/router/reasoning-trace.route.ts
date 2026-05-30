import { Router, type IRouter } from "express";

import { authenticateMiddleware } from "@/middlewares/authenticate.middleware";

import reasoningTraceController from "../controllers/reasoning-trace.controller";

const reasoningTraceRoute: IRouter = Router();

reasoningTraceRoute.use(authenticateMiddleware);

// More specific routes first
reasoningTraceRoute.get("/:traceId/events", reasoningTraceController.listEvents);
reasoningTraceRoute.get("/:traceId", reasoningTraceController.getTrace);
reasoningTraceRoute.get("/", reasoningTraceController.listTraces);

export default reasoningTraceRoute;

