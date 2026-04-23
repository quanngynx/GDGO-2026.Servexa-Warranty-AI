import { Router, type IRouter } from 'express'
import multer from 'multer'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware, requireRoles } from '@/middlewares'

import { ModelController } from '../controllers/model.controller'
import { CategoryRepository } from '../repositories/category.repository'
import { ModelRepository } from '../repositories/model.repository'
import { ModelExcelService } from '../services/model-excel.service'
import { ModelService } from '../services/model.service'

const upload = multer({ storage: multer.memoryStorage() })
const modelRoute: IRouter = Router()

const categoryRepository = new CategoryRepository()
const modelRepository = new ModelRepository()
const modelService = new ModelService(modelRepository, categoryRepository)
const modelExcelService = new ModelExcelService(modelRepository, categoryRepository)
const modelController = new ModelController(modelService, modelExcelService)

modelRoute.use(authenticateMiddleware, requireRoles([Roles.ADMIN]))

modelRoute.get('/', modelController.findAll)
modelRoute.get('/export', modelController.exportExcel)
modelRoute.post('/import', upload.single('file'), modelController.importExcel)
modelRoute.get('/:modelId', modelController.findOneById)
modelRoute.post('/', modelController.create)
modelRoute.put('/:modelId', modelController.replace)
modelRoute.patch('/:modelId', modelController.update)
modelRoute.delete('/:modelId', modelController.softDelete)
modelRoute.patch('/:modelId/restore', modelController.restore)

export default modelRoute
