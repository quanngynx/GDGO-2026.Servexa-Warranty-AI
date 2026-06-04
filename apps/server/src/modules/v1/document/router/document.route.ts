import { Router, type IRouter } from 'express'

import { multerUpload } from '@/core/file-storage/multer'
import { RoutePermissions } from '@/core/constants/route-permissions'
import {
  authenticatedWithPermissions,
  requireRoutePermissions,
} from '@/middlewares/authz.middleware'

import { DocumentController } from '../controllers/document.controller'
import { DocumentRepository } from '../repositories/document.repository'
import { DocumentService } from '../services/document.service'

const P = RoutePermissions.document
const read = requireRoutePermissions([P.read])
const write = requireRoutePermissions([P.write])
const del = requireRoutePermissions([P.delete])

const documentRoute: IRouter = Router()

const documentRepository = new DocumentRepository()
const documentService = new DocumentService(documentRepository)
const documentController = new DocumentController(documentService)

documentRoute.use(...authenticatedWithPermissions)

documentRoute.get('/', read, documentController.findAll)
documentRoute.get('/:documentId/versions', read, documentController.findVersions)
documentRoute.get('/:documentId', read, documentController.findOneById)
documentRoute.post('/', write, multerUpload.single('file'), documentController.create)
documentRoute.put('/:documentId', write, multerUpload.single('file'), documentController.replace)
documentRoute.patch('/:documentId', write, documentController.update)
documentRoute.delete('/:documentId', del, documentController.delete)

export default documentRoute
