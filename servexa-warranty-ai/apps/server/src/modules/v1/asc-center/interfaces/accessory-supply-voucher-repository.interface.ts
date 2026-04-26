import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

export interface IDocumentRepository {
  findMany(args: Prisma.DocumentFindManyArgs): Promise<unknown[]>
  count(where: Prisma.DocumentWhereInput): Promise<number>
  findById(id: string): Promise<unknown | null>
  createOne(data: Prisma.DocumentCreateInput): Promise<unknown>
  updateOneById(id: string, data: Prisma.DocumentUpdateInput): Promise<unknown>
  softDeleteById(id: string, updatedById: string): Promise<unknown>
  createVersion(data: Prisma.DocumentFileVersionCreateInput): Promise<unknown>
  findVersionsByDocumentId(documentId: string): Promise<unknown[]>
}
