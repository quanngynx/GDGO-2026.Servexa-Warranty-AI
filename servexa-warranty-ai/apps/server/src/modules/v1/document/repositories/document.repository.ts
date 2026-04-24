import prisma from "@servexa-warranty-ai/db";
import type { Prisma } from "@servexa-warranty-ai/db/prisma/client";

import type { IDocumentRepository } from "../interfaces/document-repository.interface";

const documentSelect = {
  id: true,
  title: true,
  description: true,
  detailedDescription: true,
  documentType: true,
  filePath: true,
  originalFileName: true,
  fileSize: true,
  mimeType: true,
  checksum: true,
  ascCenterId: true,
  createdById: true,
  updatedById: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.DocumentSelect;

export class DocumentRepository implements IDocumentRepository {
  async findMany(args: Prisma.DocumentFindManyArgs) {
    return prisma.document.findMany({ ...args, select: documentSelect });
  }

  async count(where: Prisma.DocumentWhereInput) {
    return prisma.document.count({ where });
  }

  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      select: documentSelect,
    });
  }

  async createOne(data: Prisma.DocumentCreateInput) {
    return prisma.document.create({ data, select: documentSelect });
  }

  async updateOneById(id: string, data: Prisma.DocumentUpdateInput) {
    return prisma.document.update({
      where: { id },
      data,
      select: documentSelect,
    });
  }

  async softDeleteById(id: string, updatedById: string) {
    return prisma.document.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: { connect: { id: updatedById } },
      },
      select: documentSelect,
    });
  }

  async createVersion(data: Prisma.DocumentFileVersionCreateInput) {
    return prisma.documentFileVersion.create({ data });
  }

  async findVersionsByDocumentId(documentId: string) {
    return prisma.documentFileVersion.findMany({
      where: { documentId },
      orderBy: { createdAt: "desc" },
    });
  }
}
