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

/**
 * Export solutions
 * @route GET /v1/product-catalog/solutions/export
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.get("/export", catalogExport, solutionController.export);
/**
 * Get all solutions
 * @route GET /v1/product-catalog/solutions
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.get("/", catalogRead, solutionController.findAll);
/**
 * Get a solution by ID
 * @route GET /v1/product-catalog/solutions/:id
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.get("/:id", catalogRead, solutionController.findOneById);
/**
 * Import solutions from a file
 * @route POST /v1/product-catalog/solutions/import
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.post(
  "/import",
  catalogImport,
  upload.single("file"),
  solutionController.import,
);
/**
 * Import solutions from a link
 * @route POST /v1/product-catalog/solutions/import-link
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.post(
  "/import-link",
  catalogImport,
  solutionController.importLink,
);
/**
 * Create a solution
 * @route POST /v1/product-catalog/solutions
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.post("/", catalogWrite, solutionController.create);
/**
 * Replace a solution
 * @route PUT /v1/product-catalog/solutions/:id
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.put("/:id", catalogWrite, solutionController.replace);
/**
 * Update a solution
 * @route PATCH /v1/product-catalog/solutions/:id
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.patch("/:id", catalogWrite, solutionController.update);
/**
 * Delete a solution
 * @route DELETE /v1/product-catalog/solutions/:id
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.delete("/:id", catalogWrite, solutionController.delete);

export default solutionRoute;
