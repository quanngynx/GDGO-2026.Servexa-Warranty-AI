import { Router, type IRouter } from "express";
import multer from "multer";

import { authenticatedWithPermissions } from "@/middlewares/authz.middleware";

import { SolutionController } from "../controllers/solution.controller";
import { SolutionRepository } from "../repositories/solution.repository";
import { SolutionService } from "../services/solution.service";
import { SolutionExcelService } from "../services/solution-excel.service";
import {
  catalogExport,
  catalogImport,
  catalogRead,
  catalogWrite,
} from "../use-cases/permission.uc";

const upload = multer({ storage: multer.memoryStorage() });
const solutionRoute: IRouter = Router();

const solutionRepository = new SolutionRepository();
const solutionService = new SolutionService(solutionRepository);
const solutionExcelService = new SolutionExcelService(solutionRepository);
const solutionController = new SolutionController(
  solutionService,
  solutionExcelService,
);

solutionRoute.use(...authenticatedWithPermissions);

solutionRoute.get("/export", catalogExport, solutionController.export);
solutionRoute.get("/", catalogRead, solutionController.findAll);
solutionRoute.get("/:id", catalogRead, solutionController.findOneById);
solutionRoute.post(
  "/import",
  catalogImport,
  upload.single("file"),
  solutionController.import,
);
solutionRoute.post(
  "/import-link",
  catalogImport,
  solutionController.importLink,
);
solutionRoute.post("/", catalogWrite, solutionController.create);
solutionRoute.put("/:id", catalogWrite, solutionController.replace);
solutionRoute.patch("/:id", catalogWrite, solutionController.update);
solutionRoute.delete("/:id", catalogWrite, solutionController.delete);

export default solutionRoute;
