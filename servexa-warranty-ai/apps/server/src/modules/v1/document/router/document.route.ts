import { Router, type IRouter } from 'express'

import { multerUpload } from '@/core/file-storage/multer'
// import { Roles } from '@/enums/roles'
import { authenticateMiddleware} from '@/middlewares'

import { DocumentController } from '../controllers/document.controller'
import { DocumentRepository } from '../repositories/document.repository'
import { DocumentService } from '../services/document.service'

const documentRoute: IRouter = Router()

const documentRepository = new DocumentRepository()
const documentService = new DocumentService(documentRepository)
const documentController = new DocumentController(documentService)

documentRoute.use(authenticateMiddleware)

/**
 * Get all documents
 * @route GET /v1/document/documents
 * @access Private
 * @returns {Promise<void>}
 */
documentRoute.get('/', documentController.findAll)
/**
 * Get document versions
 * @route GET /v1/document/documents/:documentId/versions
 * @access Private
 * @returns {Promise<void>}
 */
documentRoute.get('/:documentId/versions', documentController.findVersions)
/**
 * Get a document by ID
 * @route GET /v1/document/documents/:documentId
 * @access Private
 * @returns {Promise<void>}
 */
documentRoute.get('/:documentId', documentController.findOneById)
/**
 * Create a document
 * @route POST /v1/document/documents
 * @access Private
 * @returns {Promise<void>}
 */
documentRoute.post('/', multerUpload.single('file'), documentController.create)
/**
 * Replace a document
 * @route PUT /v1/document/documents/:documentId
 * @access Private
 * @returns {Promise<void>}
 */
documentRoute.put('/:documentId', multerUpload.single('file'), documentController.replace)
/**
 * Update a document
 * @route PATCH /v1/document/documents/:documentId
 * @access Private
 * @returns {Promise<void>}
 */
documentRoute.patch('/:documentId', documentController.update)
/**
 * Delete a document
 * @route DELETE /v1/document/documents/:documentId
 * @access Private
 * @returns {Promise<void>}
 */
documentRoute.delete('/:documentId', documentController.delete)

export default documentRoute
