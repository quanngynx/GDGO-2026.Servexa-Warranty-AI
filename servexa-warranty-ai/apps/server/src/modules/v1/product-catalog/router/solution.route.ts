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

/**
 * Export solutions
 * @route GET /v1/product-catalog/solutions/export
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.get("/export", solutionController.export);
/**
 * Get all solutions
 * @route GET /v1/product-catalog/solutions
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.get("/", solutionController.findAll);
/**
 * Get a solution by ID
 * @route GET /v1/product-catalog/solutions/:id
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.get("/:id", solutionController.findOneById);

/**
 * Import solutions
 * @route POST /v1/product-catalog/solutions/import
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.post("/import", upload.single("file"), solutionController.import);
/**
 * Import solutions by link
 * @route POST /v1/product-catalog/solutions/import-link
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.post("/import-link", solutionController.importLink);
/**
 * Create a solution
 * @route POST /v1/product-catalog/solutions
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.post("/", solutionController.create);

/**
 * Replace a solution
 * @route PUT /v1/product-catalog/solutions/:id
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.put("/:id", solutionController.replace);

/**
 * Update a solution
 * @route PATCH /v1/product-catalog/solutions/:id
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.patch("/:id", solutionController.update);

/**
 * Delete a solution
 * @route DELETE /v1/product-catalog/solutions/:id
 * @access Private
 * @returns {Promise<void>}
 */
solutionRoute.delete("/:id", solutionController.delete);

export default solutionRoute;
