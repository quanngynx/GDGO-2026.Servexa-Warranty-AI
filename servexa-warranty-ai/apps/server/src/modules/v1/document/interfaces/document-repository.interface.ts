import type { Document, DocumentFileVersion, Prisma } from '@servexa-warranty-ai/db/prisma/client'

export interface IDocumentRepository {
  findMany(args: Prisma.DocumentFindManyArgs): Promise<(Document & Prisma.DocumentInclude)[] | null>
  count(where: Prisma.DocumentWhereInput): Promise<number>
  findById(id: string): Promise<(Document & Prisma.DocumentInclude) | null>
  createOne(data: Prisma.DocumentCreateInput): Promise<(Document & Prisma.DocumentInclude) | null>
  updateOneById(id: string, data: Prisma.DocumentUpdateInput): Promise<(Document & Prisma.DocumentInclude) | null>
  softDeleteById(id: string, updatedById: string): Promise<(Document & Prisma.DocumentInclude) | null>
  createVersion(data: Prisma.DocumentFileVersionCreateInput): Promise<(DocumentFileVersion & Prisma.DocumentFileVersionInclude) | null>
  findVersionsByDocumentId(documentId: string): Promise<(DocumentFileVersion & Prisma.DocumentFileVersionInclude)[] | null>
}
