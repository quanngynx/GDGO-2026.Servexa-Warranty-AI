import { Router, type IRouter } from "express";

import { authenticateMiddleware } from "@/middlewares";

import aiController from "@/modules/v1/ai/controllers/ai.controller";

const routeAiV1: IRouter = Router();

routeAiV1.post("/query", authenticateMiddleware, aiController.unaryQuery);
routeAiV1.post("/jobs", authenticateMiddleware, aiController.enqueueJob);
routeAiV1.get("/jobs/:jobId", authenticateMiddleware, aiController.getJob);

export default routeAiV1;
