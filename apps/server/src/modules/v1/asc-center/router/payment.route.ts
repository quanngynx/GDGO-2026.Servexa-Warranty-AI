import { Router, type IRouter } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware';
// import { Roles } from '@/enums/roles';

const router: IRouter = Router();
const controller = new PaymentController();

router.use(authenticateMiddleware);

// IMPORTANT: literal `/payment-periods` MUST be registered before `/:id`-style routes.
/**
 * Get all payment periods
 * @route GET /v1/asc-center/payments/payment-periods
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/payment-periods', controller.findAllPaymentPeriods);
/**
 * Get all payments
 * @route GET /v1/asc-center/payments
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/', controller.findAllPayments);
/**
 * Mark a payment as paid
 * @route POST /v1/asc-center/payments/:id/mark-paid/:paymentPeriodId
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/:id/mark-paid/:paymentPeriodId', controller.markPaid);

export default router;
