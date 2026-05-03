import { Router, type IRouter } from 'express'
import { AccessoryRequestController } from '../controllers/accessory-request.controller'
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware'

const router: IRouter = Router()
const controller = new AccessoryRequestController()

router.use(authenticateMiddleware)

router.get('/', controller.findAll)
router.get('/:id', controller.findOneById)

router.post('/', controller.create)
router.post('/:id/items', controller.addItem)
router.post('/:id/submit', controller.submit)
router.post('/:id/approve', controller.approve)
router.post('/:id/reject', controller.reject)
router.post('/:id/recall', controller.recall)

router.patch('/:id', controller.update)
router.patch('/:id/items/:itemId', controller.updateItem)
router.delete('/:id', controller.delete)
router.delete('/:id/items/:itemId', controller.removeItem)

export default router
