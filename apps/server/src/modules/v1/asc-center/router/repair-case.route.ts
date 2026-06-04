import { Router, type IRouter } from "express";

import { repairCaseMulterUpload } from "@/core/file-storage/multer";
import { RoutePermissions } from "@/core/constants/route-permissions";
import {
  authenticatedWithPermissions,
  requireRoutePermissions,
} from "@/middlewares/authz.middleware";

import { RepairCaseController } from "../controllers/repair-case.controller";

const P = RoutePermissions.repairCase;
const read = requireRoutePermissions([P.read]);
const write = requireRoutePermissions([P.write]);
const update = requireRoutePermissions([P.update]);

const router: IRouter = Router();
const controller = new RepairCaseController();

router.use(...authenticatedWithPermissions);

// Static segments MUST go before /:id routes
/**
 * Export fixing
 * @route GET /v1/asc-center/repair-cases/exports/fixing
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/exports/fixing", read, controller.exportFixing);
/**
 * Export waiting parts
 * @route GET /v1/asc-center/repair-cases/exports/waiting-parts
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/exports/waiting-parts", read, controller.exportWaitingParts);
/**
 * Export exchange in progress
 * @route GET /v1/asc-center/repair-cases/exports/exchange-in-progress
 * @access Private
 * @returns {Promise<void>}
 */
router.get(
  "/exports/exchange-in-progress",
  read,
  controller.exportExchangeInProgress,
);
/**
 * Export repeated huyphieu
 * @route GET /v1/asc-center/repair-cases/exports/repeated-huyphieu
 * @access Private
 * @returns {Promise<void>}
 */
router.get(
  "/exports/repeated-huyphieu",
  read,
  controller.exportRepeatedHuyphieu,
);

router.get("/waiting-accessories", read, controller.findWaitingAccessories);
/**
 * Get all repair cases
 * @route GET /v1/asc-center/repair-cases
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/", read, controller.findAll);

/**
 * Create a repair case
 * @route POST /v1/asc-center/repair-cases
 * @access Private
 * @returns {Promise<void>}
 */
router.post("/", write, controller.create);

// /:id segments
/**
 * Get a repair case by ID
 * @route GET /v1/asc-center/repair-cases/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/:id", read, controller.findOneById);

/**
 * Get status history for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/status-history
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/:id/status-history", read, controller.findStatusHistory);
/**
 * Get field history for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/field-history
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/:id/field-history", read, controller.findFieldHistory);
/**
 * Get accessory requests for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/accessory-requests
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/:id/accessory-requests", read, controller.findAccessoryRequests);
/**
 * Get images for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/images
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/:id/images", read, controller.findImages);
/**
 * Download an image for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/images/:imageId/download
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/:id/images/:imageId/download", read, controller.downloadImage);

/**
 * Grant accessories to a repair case
 * @route POST /v1/asc-center/repair-cases/:id/accessories
 * @access Private
 * @returns {Promise<void>}
 */
router.post("/:id/accessories", update, controller.grantAccessories);
/**
 * Add images to a repair case
 * @route POST /v1/asc-center/repair-cases/:id/images
 * @access Private
 * @returns {Promise<void>}
 */
router.post(
  "/:id/images",
  update,
  repairCaseMulterUpload.array("files", 10),
  controller.addImages,
);

/**
 * Replace a repair case
 * @route PUT /v1/asc-center/repair-cases/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.put("/:id", write, controller.replace);

/**
 * Update a repair case
 * @route PATCH /v1/asc-center/repair-cases/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.patch("/:id", update, controller.update);

/**
 * Revoke an accessory from a repair case
 * @route DELETE /v1/asc-center/repair-cases/:id/accessories/:accessoryRowId
 * @access Private
 * @returns {Promise<void>}
 */
router.delete(
  "/:id/accessories/:accessoryRowId",
  update,
  controller.revokeAccessory,
);

/**
 * Delete an image from a repair case
 * @route DELETE /v1/asc-center/repair-cases/:id/images/:imageId
 * @access Private
 * @returns {Promise<void>}
 */
router.delete("/:id/images/:imageId", update, controller.deleteImage);

export default router;
