import { Router, type IRouter } from "express";

import { authenticatedWithPermissions } from "@/middlewares/authz.middleware";

import { WarrantyPolicyController } from "../controllers/warranty-policy.controller";
import { CategoryRepository } from "../repositories/category.repository";
import { ModelRepository } from "../repositories/model.repository";
import { WarrantyPolicyRepository } from "../repositories/warranty-policy.repository";
import { WarrantyPolicyService } from "../services/warranty-policy.service";
import { catalogRead, catalogWrite } from "../use-cases/permission.uc";

const warrantyPolicyRoute: IRouter = Router();

const warrantyPolicyRepository = new WarrantyPolicyRepository();
const categoryRepository = new CategoryRepository();
const modelRepository = new ModelRepository();
const warrantyPolicyService = new WarrantyPolicyService(
  warrantyPolicyRepository,
  categoryRepository,
  modelRepository,
);
const warrantyPolicyController = new WarrantyPolicyController(
  warrantyPolicyService,
);

warrantyPolicyRoute.use(...authenticatedWithPermissions);

/**
 * Get all warranty policies
 * @route GET /v1/product-catalog/warranty-policies
 * @access Private
 * @returns {Promise<void>}
 */
warrantyPolicyRoute.get("/", catalogRead, warrantyPolicyController.findAll);
/**
 * Resolve a warranty policy
 * @route GET /v1/product-catalog/warranty-policies/resolve
 * @access Private
 * @returns {Promise<void>}
 */
warrantyPolicyRoute.get(
  "/resolve",
  catalogRead,
  warrantyPolicyController.resolve,
);
/**
 * Get a warranty policy by ID
 * @route GET /v1/product-catalog/warranty-policies/:warrantyPolicyId
 * @access Private
 * @returns {Promise<void>}
 */
warrantyPolicyRoute.get(
  "/:warrantyPolicyId",
  catalogRead,
  warrantyPolicyController.findOneById,
);
/**
 * Create a warranty policy
 * @route POST /v1/product-catalog/warranty-policies
 * @access Private
 * @returns {Promise<void>}
 */
warrantyPolicyRoute.post("/", catalogWrite, warrantyPolicyController.create);
/**
 * Replace a warranty policy
 * @route PUT /v1/product-catalog/warranty-policies/:warrantyPolicyId
 * @access Private
 * @returns {Promise<void>}
 */
warrantyPolicyRoute.put(
  "/:warrantyPolicyId",
  catalogWrite,
  warrantyPolicyController.replace,
);
/**
 * Update a warranty policy
 * @route PATCH /v1/product-catalog/warranty-policies/:warrantyPolicyId
 * @access Private
 * @returns {Promise<void>}
 */
warrantyPolicyRoute.patch(
  "/:warrantyPolicyId",
  catalogWrite,
  warrantyPolicyController.update,
);
/**
 * Delete a warranty policy
 * @route DELETE /v1/product-catalog/warranty-policies/:warrantyPolicyId
 * @access Private
 * @returns {Promise<void>}
 */
warrantyPolicyRoute.delete(
  "/:warrantyPolicyId",
  catalogWrite,
  warrantyPolicyController.delete,
);

export default warrantyPolicyRoute;
