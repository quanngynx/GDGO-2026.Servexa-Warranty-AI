import { Router, type IRouter } from 'express'

import { RoutePermissions } from '@/core/constants/route-permissions'
import {
  authenticatedWithPermissions,
  requireRoutePermissions,
} from '@/middlewares/authz.middleware'
import { AccessoryRequestController } from '../controllers/accessory-request.controller'

const P = RoutePermissions.accessoryRequest
const read = requireRoutePermissions([P.read])
const write = requireRoutePermissions([P.write])

const router: IRouter = Router()
const controller = new AccessoryRequestController()

router.use(...authenticatedWithPermissions)

router.get('/', read, controller.findAll)
router.get('/:id', read, controller.findOneById)
router.post('/', write, controller.create)
router.post('/:id/items', write, controller.addItem)
router.post('/:id/submit', write, controller.submit)
router.post('/:id/approve', write, controller.approve)
router.post('/:id/reject', write, controller.reject)
router.post('/:id/recall', write, controller.recall)
router.patch('/:id', write, controller.update)
router.patch('/:id/items/:itemId', write, controller.updateItem)
router.delete('/:id', write, controller.delete)
router.delete('/:id/items/:itemId', write, controller.removeItem)

export default router
