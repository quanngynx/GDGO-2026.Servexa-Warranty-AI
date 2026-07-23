import { Router, type IRouter } from "express";

import { authenticatedWithPermissions } from "@/middlewares/authz.middleware";

import { TotalWarehouseController } from "../controllers/total-warehouse.controller";
import { TotalWarehouseRepository } from "../repositories/total-warehouse.repository";
import { TotalWarehouseService } from "../services/total-warehouse.service";
import { catalogRead, catalogWrite } from "../use-cases/permission.uc";

const totalWarehouseRoute: IRouter = Router();

const totalWarehouseRepository = new TotalWarehouseRepository();
const totalWarehouseService = new TotalWarehouseService(
  totalWarehouseRepository,
);
const totalWarehouseController = new TotalWarehouseController(
  totalWarehouseService,
);

totalWarehouseRoute.use(...authenticatedWithPermissions);

/**
 * Get all total warehouses
 * @route GET /v1/product-catalog/total-warehouses
 * @access Private
 * @returns {Promise<void>}
 */
totalWarehouseRoute.get("/", catalogRead, totalWarehouseController.findAll);
/**
 * Get a total warehouse by ID
 * @route GET /v1/product-catalog/total-warehouses/:totalWarehouseId
 * @access Private
 * @returns {Promise<void>}
 */
totalWarehouseRoute.get(
  "/:totalWarehouseId",
  catalogRead,
  totalWarehouseController.findOneById,
);
/**
 * Create a total warehouse
 * @route POST /v1/product-catalog/total-warehouses
 * @access Private
 * @returns {Promise<void>}
 */
totalWarehouseRoute.post("/", catalogWrite, totalWarehouseController.create);
/**
 * Replace a total warehouse
 * @route PUT /v1/product-catalog/total-warehouses/:totalWarehouseId
 * @access Private
 * @returns {Promise<void>}
 */
totalWarehouseRoute.put(
  "/:totalWarehouseId",
  catalogWrite,
  totalWarehouseController.replace,
);
/**
 * Update a total warehouse
 * @route PATCH /v1/product-catalog/total-warehouses/:totalWarehouseId
 * @access Private
 * @returns {Promise<void>}
 */
totalWarehouseRoute.patch(
  "/:totalWarehouseId",
  catalogWrite,
  totalWarehouseController.update,
);
/**
 * Delete a total warehouse
 * @route DELETE /v1/product-catalog/total-warehouses/:totalWarehouseId
 * @access Private
 * @returns {Promise<void>}
 */
totalWarehouseRoute.delete(
  "/:totalWarehouseId",
  catalogWrite,
  totalWarehouseController.delete,
);

export default totalWarehouseRoute;
