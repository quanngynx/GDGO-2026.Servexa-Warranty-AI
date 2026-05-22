import { Router, type IRouter } from "express";
import multer from "multer";

import { authenticateMiddleware} from "@/middlewares";

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

errorPhenomenonRoute.use(authenticateMiddleware);

/**
 * Export error phenomena
 * @route GET /v1/product-catalog/error-phenomena/export
 * @access Private
 * @returns {Promise<void>}
 */
errorPhenomenonRoute.get("/export", errorPhenomenonController.export);
/**
 * Get all error phenomena
 * @route GET /v1/product-catalog/error-phenomena
 * @access Private
 * @returns {Promise<void>}
 */
errorPhenomenonRoute.get("/", errorPhenomenonController.findAll);
/**
 * Get a error phenomenon by ID
 * @route GET /v1/product-catalog/error-phenomena/:id
 * @access Private
 * @returns {Promise<void>}
 */
errorPhenomenonRoute.get("/:id", errorPhenomenonController.findOneById);

/**
 * Import error phenomena
 * @route POST /v1/product-catalog/error-phenomena/import
 * @access Private
 * @returns {Promise<void>}
 */
errorPhenomenonRoute.post(
  "/import",
  upload.single("file"),
  errorPhenomenonController.import,
);
/**
 * Import error phenomena by link
 * @route POST /v1/product-catalog/error-phenomena/import-link
 * @access Private
 * @returns {Promise<void>}
 */
errorPhenomenonRoute.post("/import-link", errorPhenomenonController.importLink);
/**
 * Create a error phenomenon
 * @route POST /v1/product-catalog/error-phenomena
 * @access Private
 * @returns {Promise<void>}
 */
errorPhenomenonRoute.post("/", errorPhenomenonController.create);

/**
 * Replace a error phenomenon
 * @route PUT /v1/product-catalog/error-phenomena/:id
 * @access Private
 * @returns {Promise<void>}
 */
errorPhenomenonRoute.put("/:id", errorPhenomenonController.replace);

/**
 * Update a error phenomenon
 * @route PATCH /v1/product-catalog/error-phenomena/:id
 * @access Private
 * @returns {Promise<void>}
 */
errorPhenomenonRoute.patch("/:id", errorPhenomenonController.update);

/**
 * Delete a error phenomenon
 * @route DELETE /v1/product-catalog/error-phenomena/:id
 * @access Private
 * @returns {Promise<void>}
 */
errorPhenomenonRoute.delete("/:id", errorPhenomenonController.delete);

export default errorPhenomenonRoute;
