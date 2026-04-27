import { Router, type IRouter } from 'express'
import { AccessoryRequestController } from '../controllers/accessory-request.controller'
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware'
import { requireRoles } from '@/middlewares/require-roles.middleware'
import { Roles } from '@/enums/roles'

const router: IRouter = Router()
const controller = new AccessoryRequestController()

router.use(authenticateMiddleware)

const standardRoles = [
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.COMPANY_ADMIN,
  Roles.ASC_ADMIN,
  Roles.ASC_MANAGER,
  Roles.ASC_COORDINATOR,
  Roles.ASC_TECHNICIAN,
]
const approverRoles = [
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.COMPANY_ADMIN,
  Roles.ASC_ADMIN,
  Roles.ASC_MANAGER,
]

router.use(requireRoles(standardRoles))

router.get('/', controller.findAll)
router.get('/:id', controller.findOneById)

router.post('/', controller.create)
router.post('/:id/items', controller.addItem)
router.post('/:id/submit', controller.submit)
router.post('/:id/approve', requireRoles(approverRoles), controller.approve)
router.post('/:id/reject', requireRoles(approverRoles), controller.reject)
router.post('/:id/recall', requireRoles(approverRoles), controller.recall)

router.patch('/:id', controller.update)
router.patch('/:id/items/:itemId', controller.updateItem)
router.delete('/:id', controller.delete)
router.delete('/:id/items/:itemId', controller.removeItem)

export default router
