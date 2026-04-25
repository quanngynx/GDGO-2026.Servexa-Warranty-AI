import { Router, type IRouter } from "express";
import multer from "multer";

import { Roles } from "@/enums/roles";
import { authenticateMiddleware, requireRoles } from "@/middlewares";

import { ErrorPhenomenonController } from "../controllers/error-phenomenon.controller";
import { ErrorPhenomenonRepository } from "../repositories/error-phenomenon.repository";
import { ErrorPhenomenonService } from "../services/error-phenomenon.service";
import { ErrorPhenomenonExcelService } from "../services/error-phenomenon-excel.service";

const upload = multer({ storage: multer.memoryStorage() });
const errorPhenomenonRoute: IRouter = Router();

const errorPhenomenonRepository = new ErrorPhenomenonRepository();
const errorPhenomenonService = new ErrorPhenomenonService(
  errorPhenomenonRepository,
);
const errorPhenomenonExcelService = new ErrorPhenomenonExcelService(
  errorPhenomenonRepository,
);
const errorPhenomenonController = new ErrorPhenomenonController(
  errorPhenomenonService,
  errorPhenomenonExcelService,
);

errorPhenomenonRoute.use(authenticateMiddleware, requireRoles([Roles.ADMIN]));

errorPhenomenonRoute.get("/export", errorPhenomenonController.export);
errorPhenomenonRoute.get("/", errorPhenomenonController.findAll);
errorPhenomenonRoute.get("/:id", errorPhenomenonController.findOneById);

errorPhenomenonRoute.post(
  "/import",
  upload.single("file"),
  errorPhenomenonController.import,
);
errorPhenomenonRoute.post("/import-link", errorPhenomenonController.importLink);
errorPhenomenonRoute.post("/", errorPhenomenonController.create);

errorPhenomenonRoute.put("/:id", errorPhenomenonController.replace);

errorPhenomenonRoute.patch("/:id", errorPhenomenonController.update);

errorPhenomenonRoute.delete("/:id", errorPhenomenonController.delete);

export default errorPhenomenonRoute;
