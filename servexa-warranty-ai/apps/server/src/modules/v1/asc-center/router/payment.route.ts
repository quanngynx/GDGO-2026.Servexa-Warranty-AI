import { Router, type IRouter } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware';
import { requireRoles } from '@/middlewares/require-roles.middleware';
import { Roles } from '@/enums/roles';

const router: IRouter = Router();
const controller = new PaymentController();

router.use(authenticateMiddleware);

const readRoles = [
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.COMPANY_ADMIN,
  Roles.ASC_ADMIN,
  Roles.ASC_MANAGER,
  Roles.ASC_COORDINATOR,
];

const writeRoles = [
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.COMPANY_ADMIN,
  Roles.ASC_ADMIN,
  Roles.ASC_MANAGER,
];

router.use(requireRoles(readRoles));

// IMPORTANT: literal `/payment-periods` MUST be registered before `/:id`-style routes.
router.get('/payment-periods', controller.findAllPaymentPeriods);
router.get('/', controller.findAllPayments);
router.post('/:id/mark-paid/:paymentPeriodId', requireRoles(writeRoles), controller.markPaid);

export default router;
