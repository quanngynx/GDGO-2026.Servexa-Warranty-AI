import { Router, type IRouter } from "express";

import { RoutePermissions } from "@/core/constants/route-permissions";
import {
  authenticatedWithPermissions,
  requireRoutePermissions,
} from "@/middlewares/authz.middleware";
import { PaymentController } from "../controllers/payment.controller";

const P = RoutePermissions.payment;

const router: IRouter = Router();
const controller = new PaymentController();

const read = requireRoutePermissions([P.read]);
const write = requireRoutePermissions([P.write]);

router.use(...authenticatedWithPermissions);

// IMPORTANT: literal `/payment-periods` MUST be registered before `/:id`-style routes.
/**
 * Get all payment periods
 * @route GET /v1/asc-center/payments/payment-periods
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/payment-periods", read, controller.findAllPaymentPeriods);
/**
 * Get all payments
 * @route GET /v1/asc-center/payments
 * @access Private
 * @returns {Promise<void>}
 */
router.get("/", read, controller.findAllPayments);
/**
 * Mark a payment as paid
 * @route POST /v1/asc-center/payments/:id/mark-paid/:paymentPeriodId
 * @access Private
 * @returns {Promise<void>}
 */
router.post("/:id/mark-paid/:paymentPeriodId", write, controller.markPaid);

export default router;
