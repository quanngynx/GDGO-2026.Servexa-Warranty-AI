import type { CreateDocumentDto, FindAllDocumentsInput, ReplaceDocumentDto, UpdateDocumentDto } from '../dtos/document.dto'

export interface FileUploadMeta {
  filePath: string
  originalFileName: string
  fileSize: number
  mimeType: string
  checksum: string
}

export interface IDocumentService {
  findAll(query: FindAllDocumentsInput): Promise<unknown>
  findOneById(documentId: string): Promise<unknown>
  create(input: CreateDocumentDto, createdById: string, file?: FileUploadMeta): Promise<unknown>
  replace(documentId: string, input: ReplaceDocumentDto, updatedById: string, file?: FileUploadMeta): Promise<unknown>
  update(documentId: string, input: UpdateDocumentDto, updatedById: string): Promise<unknown>
  delete(documentId: string, updatedById: string): Promise<{ success: true }>
  findVersions(documentId: string): Promise<unknown>
}
