import { Router, type IRouter } from "express";
import multer from "multer";

import { authenticateMiddleware} from "@/middlewares";

import { SolutionController } from "../controllers/solution.controller";
import { SolutionRepository } from "../repositories/solution.repository";
import { SolutionService } from "../services/solution.service";
import { SolutionExcelService } from "../services/solution-excel.service";

const upload = multer({ storage: multer.memoryStorage() });
const solutionRoute: IRouter = Router();

const solutionRepository = new SolutionRepository();
const solutionService = new SolutionService(solutionRepository);
const solutionExcelService = new SolutionExcelService(solutionRepository);
const solutionController = new SolutionController(
  solutionService,
  solutionExcelService,
);

solutionRoute.use(authenticateMiddleware);

solutionRoute.get("/export", solutionController.export);
solutionRoute.get("/", solutionController.findAll);
solutionRoute.get("/:id", solutionController.findOneById);

solutionRoute.post("/import", upload.single("file"), solutionController.import);
solutionRoute.post("/import-link", solutionController.importLink);
solutionRoute.post("/", solutionController.create);

solutionRoute.put("/:id", solutionController.replace);

solutionRoute.patch("/:id", solutionController.update);

solutionRoute.delete("/:id", solutionController.delete);

export default solutionRoute;
