import { Router, type IRouter } from "express";
import multer from "multer";

import { authenticatedWithPermissions } from "@/middlewares/authz.middleware";

import { ErrorPhenomenonController } from "../controllers/error-phenomenon.controller";
import { ErrorPhenomenonRepository } from "../repositories/error-phenomenon.repository";
import { ErrorPhenomenonService } from "../services/error-phenomenon.service";
import { ErrorPhenomenonExcelService } from "../services/error-phenomenon-excel.service";
import {
  catalogExport,
  catalogImport,
  catalogRead,
  catalogWrite,
} from "../use-cases/permission.uc";

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

errorPhenomenonRoute.use(...authenticatedWithPermissions);

errorPhenomenonRoute.get(
  "/export",
  catalogExport,
  errorPhenomenonController.export,
);
errorPhenomenonRoute.get("/", catalogRead, errorPhenomenonController.findAll);
errorPhenomenonRoute.get(
  "/:id",
  catalogRead,
  errorPhenomenonController.findOneById,
);
errorPhenomenonRoute.post(
  "/import",
  catalogImport,
  upload.single("file"),
  errorPhenomenonController.import,
);
errorPhenomenonRoute.post(
  "/import-link",
  catalogImport,
  errorPhenomenonController.importLink,
);
errorPhenomenonRoute.post("/", catalogWrite, errorPhenomenonController.create);
errorPhenomenonRoute.put(
  "/:id",
  catalogWrite,
  errorPhenomenonController.replace,
);
errorPhenomenonRoute.patch(
  "/:id",
  catalogWrite,
  errorPhenomenonController.update,
);
errorPhenomenonRoute.delete(
  "/:id",
  catalogWrite,
  errorPhenomenonController.delete,
);

export default errorPhenomenonRoute;
