import type { Document, DocumentFileVersion, Prisma } from '@servexa-warranty-ai/db/prisma/client'
import type { CreateDocumentDto, FindAllDocumentsInput, ReplaceDocumentDto, UpdateDocumentDto } from '../dtos/document.dto'
import type { BasePagination } from '@/types/pagination'

export interface FileUploadMeta {
  filePath: string
  originalFileName: string
  fileSize: number
  mimeType: string
  checksum: string
}

export interface IDocumentService {
  findAll(query: FindAllDocumentsInput): Promise<{ items: (Document & Prisma.DocumentInclude)[] | null, pagination: BasePagination }>
  findOneById(documentId: string): Promise<(Document & Prisma.DocumentInclude) | null>
  create(input: CreateDocumentDto, createdById: string, file?: FileUploadMeta): Promise<(Document & Prisma.DocumentInclude) | null>
  replace(documentId: string, input: ReplaceDocumentDto, updatedById: string, file?: FileUploadMeta): Promise<(Document & Prisma.DocumentInclude) | null>
  update(documentId: string, input: UpdateDocumentDto, updatedById: string): Promise<(Document & Prisma.DocumentInclude) | null>
  delete(documentId: string, updatedById: string): Promise<{ success: true }>
  findVersions(documentId: string): Promise<(DocumentFileVersion & Prisma.DocumentFileVersionInclude)[] | null>
}
