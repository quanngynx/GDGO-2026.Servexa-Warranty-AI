import { Router, type IRouter } from 'express';
import { AscStocktakeController } from '../controllers/asc-stocktake.controller';
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware';

const router: IRouter = Router();
const controller = new AscStocktakeController();

router.use(authenticateMiddleware);

// const standardRoles = [
//   Roles.SUPER_ADMIN,
//   Roles.ADMIN,
//   Roles.COMPANY_ADMIN,
//   Roles.ASC_ADMIN,
//   Roles.ASC_MANAGER,
//   Roles.ASC_COORDINATOR,
//   Roles.ASC_TECHNICIAN,
// ];
// const writeRoles = [
//   Roles.SUPER_ADMIN,
//   Roles.ADMIN,
//   Roles.COMPANY_ADMIN,
//   Roles.ASC_ADMIN,
//   Roles.ASC_MANAGER,
//   Roles.ASC_TECHNICIAN,
// ];

// Order matters: register specific routes before `/:id`
/**
 * Get accessories for a stocktake
 * @route GET /v1/asc-center/asc-stocktakes/asc-centers/:ascCenterId/accessories
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/asc-centers/:ascCenterId/accessories', controller.findAccessoriesForStocktake);
/**
 * Get stock levels for a stocktake
 * @route GET /v1/asc-center/asc-stocktakes/asc-centers/:ascCenterId/stock-levels
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/asc-centers/:ascCenterId/stock-levels', controller.findStockLevels);
/**
 * Get history by center for a stocktake
 * @route GET /v1/asc-center/asc-stocktakes/asc-centers/:ascCenterId
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/asc-centers/:ascCenterId', controller.findHistoryByCenter);
/**
 * Get a stocktake by ID
 * @route GET /v1/asc-center/asc-stocktakes/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/:id', controller.findOneById);
/**
 * Create a stocktake
 * @route POST /v1/asc-center/asc-stocktakes
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/', controller.create);

export default router;
