import { Router, type IRouter } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware';
// import { Roles } from '@/enums/roles';

const router: IRouter = Router();
const controller = new PaymentController();

router.use(authenticateMiddleware);

// IMPORTANT: literal `/payment-periods` MUST be registered before `/:id`-style routes.
router.get('/payment-periods', controller.findAllPaymentPeriods);
router.get('/', controller.findAllPayments);
router.post('/:id/mark-paid/:paymentPeriodId', controller.markPaid);

export default router;
