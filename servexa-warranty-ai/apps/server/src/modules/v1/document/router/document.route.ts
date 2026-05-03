import { Router, type IRouter } from 'express'

import { multerUpload } from '@/core/file-storage/multer'
import { Roles } from '@/enums/roles'
import { authenticateMiddleware} from '@/middlewares'

import { DocumentController } from '../controllers/document.controller'
import { DocumentRepository } from '../repositories/document.repository'
import { DocumentService } from '../services/document.service'

const documentRoute: IRouter = Router()

const documentRepository = new DocumentRepository()
const documentService = new DocumentService(documentRepository)
const documentController = new DocumentController(documentService)

documentRoute.use(authenticateMiddleware)

documentRoute.get('/', documentController.findAll)
documentRoute.get('/:documentId/versions', documentController.findVersions)
documentRoute.get('/:documentId', documentController.findOneById)
documentRoute.post('/', multerUpload.single('file'), documentController.create)
documentRoute.put('/:documentId', multerUpload.single('file'), documentController.replace)
documentRoute.patch('/:documentId', documentController.update)
documentRoute.delete('/:documentId', documentController.delete)

export default documentRoute
