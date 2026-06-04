import { Router, type IRouter } from "express";

import { authenticatedWithPermissions } from "@/middlewares/authz.middleware";

import { CategoryController } from "../controllers/category.controller";
import { catalogRead, catalogWrite } from "../use-cases/permission.uc";
import { CategoryRepository } from "../repositories/category.repository";
import { CategoryService } from "../services/category.service";

const categoryRoute: IRouter = Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

categoryRoute.use(...authenticatedWithPermissions);

/**
 * Get all categories
 * @route GET /v1/product-catalog/categories
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.get("/", catalogRead, categoryController.findAll);
/**
 * Get a category by ID
 * @route GET /v1/product-catalog/categories/:categoryId
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.get("/:categoryId", catalogRead, categoryController.findOneById);
/**
 * Create a category
 * @route POST /v1/product-catalog/categories
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.post("/", catalogWrite, categoryController.create);
/**
 * Replace a category
 * @route PUT /v1/product-catalog/categories/:categoryId
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.put("/:categoryId", catalogWrite, categoryController.replace);
/**
 * Update a category
 * @route PATCH /v1/product-catalog/categories/:categoryId
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.patch("/:categoryId", catalogWrite, categoryController.update);
/**
 * Delete a category
 * @route DELETE /v1/product-catalog/categories/:categoryId
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.delete("/:categoryId", catalogWrite, categoryController.delete);

export default categoryRoute;
