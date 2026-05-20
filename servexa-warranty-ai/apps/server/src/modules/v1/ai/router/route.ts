import { Router, type IRouter } from "express";

import { authenticateMiddleware } from "@/middlewares";

import aiController from "@/modules/v1/ai/controllers/ai.controller";
import knowledgeController from "@/modules/v1/ai/controllers/knowledge.controller";
import workflowController from "@/modules/v1/ai/controllers/workflow.controller";
import opsController from "@/modules/v1/ai/controllers/ops.controller";
import hitlRoute from "@/modules/v1/ai/router/hitl.route";

const routeAiV1: IRouter = Router();

routeAiV1.post("/knowledge/internal-ingest", knowledgeController.internalIngest);

routeAiV1.post("/query", authenticateMiddleware, aiController.unaryQuery);
routeAiV1.post("/jobs", authenticateMiddleware, aiController.enqueueJob);
routeAiV1.get("/jobs/:jobId", authenticateMiddleware, aiController.getJob);
routeAiV1.post("/jobs/replay", authenticateMiddleware, aiController.replayJob);

routeAiV1.post(
  "/knowledge/ingest-text",
  authenticateMiddleware,
  knowledgeController.ingestText,
);
routeAiV1.post(
  "/knowledge/ingest-document",
  authenticateMiddleware,
  knowledgeController.ingestDocument,
);
routeAiV1.post(
  "/knowledge/reindex",
  authenticateMiddleware,
  knowledgeController.reindexDocument,
);
routeAiV1.get("/knowledge/search", authenticateMiddleware, knowledgeController.search);

routeAiV1.post("/workflows/step", authenticateMiddleware, workflowController.step);
routeAiV1.get("/tools", authenticateMiddleware, workflowController.listTools);
routeAiV1.post("/tools/invoke", authenticateMiddleware, workflowController.invokeTool);
routeAiV1.post("/agents/coordinate", authenticateMiddleware, workflowController.coordinate);

routeAiV1.get("/ops/summary", authenticateMiddleware, opsController.summary);

routeAiV1.use("/hitl", hitlRoute);

export default routeAiV1;
