import prisma from "@/core/infra/prisma";
import { Prisma } from "@/core/infra/prisma/generated/client";

import { documentRecordSelect } from "../document.types";
import type { IDocumentRepository } from "../interfaces/document-repository.interface";

export class DocumentRepository implements IDocumentRepository {
  async findMany(args: Prisma.DocumentFindManyArgs) {
    return prisma.document.findMany({ ...args, select: documentRecordSelect });
  }

  async count(where: Prisma.DocumentWhereInput) {
    return prisma.document.count({ where });
  }

  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      select: documentRecordSelect,
    });
  }

  async createOne(data: Prisma.DocumentCreateInput) {
    return prisma.document.create({ data, select: documentRecordSelect });
  }

  async updateOneById(id: string, data: Prisma.DocumentUpdateInput) {
    return prisma.document.update({
      where: { id },
      data,
      select: documentRecordSelect,
    });
  }

  async softDeleteById(id: string, updatedById: string) {
    return prisma.document.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: { connect: { id: updatedById } },
      },
      select: documentRecordSelect,
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
