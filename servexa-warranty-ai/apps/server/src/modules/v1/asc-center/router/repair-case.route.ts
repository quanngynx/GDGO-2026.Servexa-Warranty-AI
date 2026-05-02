import { Router, type IRouter } from 'express'
import multer from 'multer'
import fs from 'fs'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware'

import { RepairCaseController } from '../controllers/repair-case.controller'

// Ensure upload directory exists
const uploadDir = 'uploads/repair-cases'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
const multerUpload = multer({ dest: uploadDir })

const router: IRouter = Router()
const controller = new RepairCaseController()

router.use(authenticateMiddleware)

// Static segments MUST go before /:id routes
router.get('/exports/fixing', controller.exportFixing)
router.get('/exports/waiting-parts', controller.exportWaitingParts)
router.get('/exports/exchange-in-progress', controller.exportExchangeInProgress)
router.get('/exports/repeated-huyphieu', controller.exportRepeatedHuyphieu)

router.get('/waiting-accessories', controller.findWaitingAccessories)
router.get('/', controller.findAll)

router.post('/', controller.create)

// /:id segments
router.get('/:id', controller.findOneById)

router.get('/:id/status-history', controller.findStatusHistory)
router.get('/:id/field-history', controller.findFieldHistory)
router.get('/:id/accessory-requests', controller.findAccessoryRequests)
router.get('/:id/images', controller.findImages)
router.get('/:id/images/:imageId/download', controller.downloadImage)

router.post('/:id/accessories', controller.grantAccessories)
router.post('/:id/images', multerUpload.array('files', 10), controller.addImages)

router.put('/:id', controller.replace)

router.patch('/:id', controller.update)

router.delete('/:id/accessories/:accessoryRowId', controller.revokeAccessory)

router.delete('/:id/images/:imageId', controller.deleteImage)

export default router
