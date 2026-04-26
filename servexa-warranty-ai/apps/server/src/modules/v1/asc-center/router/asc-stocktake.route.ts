import { Router, type IRouter } from 'express';
import { AscStocktakeController } from '../controllers/asc-stocktake.controller';
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware';
import { requireRoles } from '@/middlewares/require-roles.middleware';
import { Roles } from '@/enums/roles';

const router: IRouter = Router();
const controller = new AscStocktakeController();

router.use(authenticateMiddleware);

const standardRoles = [
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.COMPANY_ADMIN,
  Roles.ASC_ADMIN,
  Roles.ASC_MANAGER,
  Roles.ASC_COORDINATOR,
  Roles.ASC_TECHNICIAN,
];
const writeRoles = [
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.COMPANY_ADMIN,
  Roles.ASC_ADMIN,
  Roles.ASC_MANAGER,
  Roles.ASC_TECHNICIAN,
];

router.use(requireRoles(standardRoles));

// Order matters: register specific routes before `/:id`
router.get('/asc-centers/:ascCenterId/accessories', controller.findAccessoriesForStocktake);
router.get('/asc-centers/:ascCenterId/stock-levels', controller.findStockLevels);
router.get('/asc-centers/:ascCenterId', controller.findHistoryByCenter);
router.get('/:id', controller.findOneById);

router.post('/', requireRoles(writeRoles), controller.create);

export default router;
