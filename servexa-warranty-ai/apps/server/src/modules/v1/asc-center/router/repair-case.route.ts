import { Router, type IRouter } from 'express'
import multer from 'multer'
import fs from 'fs'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware'
import { requireRoles } from '@/middlewares/require-roles.middleware'

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

const readRoles = [
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.COMPANY_ADMIN,
  Roles.ASC_ADMIN,
  Roles.ASC_MANAGER,
  Roles.ASC_COORDINATOR,
  Roles.ASC_TECHNICIAN,
]

const writeRoles = [
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.COMPANY_ADMIN,
  Roles.ASC_ADMIN,
  Roles.ASC_MANAGER,
  Roles.ASC_COORDINATOR,
  Roles.ASC_TECHNICIAN, // Assume technicians can write some things
]

router.use(requireRoles(readRoles))

// Static segments MUST go before /:id routes
router.get('/exports/fixing', controller.exportFixing)
router.get('/exports/waiting-parts', controller.exportWaitingParts)
router.get('/exports/exchange-in-progress', controller.exportExchangeInProgress)
router.get('/exports/repeated-huyphieu', controller.exportRepeatedHuyphieu)

router.get('/waiting-accessories', controller.findWaitingAccessories)
router.get('/', controller.findAll)

router.post('/', requireRoles(writeRoles), controller.create)

// /:id segments
router.get('/:id', controller.findOneById)
router.put('/:id', requireRoles(writeRoles), controller.replace)
router.patch('/:id', requireRoles(writeRoles), controller.update)

router.get('/:id/status-history', controller.findStatusHistory)
router.get('/:id/field-history', controller.findFieldHistory)
router.get('/:id/accessory-requests', controller.findAccessoryRequests)

router.post('/:id/accessories', requireRoles(writeRoles), controller.grantAccessories)
router.delete('/:id/accessories/:accessoryRowId', requireRoles(writeRoles), controller.revokeAccessory)

router.get('/:id/images', controller.findImages)
router.get('/:id/images/:imageId/download', controller.downloadImage)
router.post('/:id/images', requireRoles(writeRoles), multerUpload.array('files', 10), controller.addImages)
router.delete('/:id/images/:imageId', requireRoles(writeRoles), controller.deleteImage)

export default router
