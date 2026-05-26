import crypto from "node:crypto";
import fs from "node:fs";

import { Prisma } from "@servexa-warranty-ai/db/prisma/client";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { buildPagination } from "@/utils/pagination";

import type {
  CreateDocumentDto,
  FindAllDocumentsInput,
  ReplaceDocumentDto,
  UpdateDocumentDto,
} from "../dtos/document.dto";
import type {
  FileUploadMeta,
  IDocumentService,
} from "../interfaces/document-service.interface";
import type { IDocumentRepository } from "../interfaces/document-repository.interface";
import { DocumentRepository } from "../repositories/document.repository";

const computeChecksum = (filePath: string): string => {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
};

export class DocumentService implements IDocumentService {
  constructor(
    private readonly documentRepository: IDocumentRepository = new DocumentRepository(),
  ) {}

  private async ensureExists(documentId: string) {
    const doc = await this.documentRepository.findById(documentId);
    if (!doc)
      throw createOperationalError(
        "Document not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    return doc;
  }

  async findAll(query: FindAllDocumentsInput) {
    const where: Prisma.DocumentWhereInput = {
      ...(query.includeDeleted ? {} : { deletedAt: null }),
      ...(query.search
        ? { title: { contains: query.search, mode: "insensitive" } }
        : {}),
      ...(query.documentType ? { documentType: query.documentType } : {}),
      ...(query.ascCenterId ? { ascCenterId: query.ascCenterId } : {}),
    };

    const [items, total] = await Promise.all([
      this.documentRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        include: {
          createdBy: {
            select: {
              fullName: true,
              username: true,
            },
          },
          updatedBy: {
            select: {
              fullName: true,
              username: true,
            },
          },
          ascCenter: {
            select: {
              centerName: true,
              centerCode: true,
            },
          },
        },
      }),
      this.documentRepository.count(where),
    ]);

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    };
  }

  async findOneById(documentId: string) {
    return this.ensureExists(documentId);
  }

  async create(
    input: CreateDocumentDto,
    createdById: string,
    file?: FileUploadMeta,
  ) {
    const resolvedFile = file ?? null;

    const checksum = resolvedFile?.filePath
      ? computeChecksum(resolvedFile.filePath)
      : (resolvedFile?.checksum ?? undefined);

    const data: Prisma.DocumentCreateInput = {
      title: input.title,
      description: input.description,
      detailedDescription: input.detailedDescription,
      documentType: input.documentType,
      createdBy: { connect: { id: createdById } },
      ...(input.ascCenterId
        ? { ascCenter: { connect: { id: input.ascCenterId } } }
        : {}),
      ...(resolvedFile
        ? {
            filePath: resolvedFile.filePath,
            originalFileName: resolvedFile.originalFileName,
            fileSize: resolvedFile.fileSize,
            mimeType: resolvedFile.mimeType,
            checksum,
          }
        : {}),
    };

    return this.documentRepository.createOne(data);
  }

  async replace(
    documentId: string,
    input: ReplaceDocumentDto,
    updatedById: string,
    file?: FileUploadMeta,
  ) {
    const existing = await this.ensureExists(documentId);

    // Snapshot old file metadata into version history if a file existed
    if (existing["filePath"]) {
      await this.documentRepository.createVersion({
        document: { connect: { id: documentId } },
        filePath: existing["filePath"] as string,
        originalFileName: (existing["originalFileName"] as string) ?? "",
        fileSize: (existing["fileSize"] as number | null) ?? undefined,
        mimeType: (existing["mimeType"] as string | null) ?? undefined,
        checksum: (existing["checksum"] as string | null) ?? undefined,
        createdBy: { connect: { id: updatedById } },
      });
    }

    const checksum = file?.filePath
      ? computeChecksum(file.filePath)
      : (file?.checksum ?? undefined);

    const data: Prisma.DocumentUpdateInput = {
      title: input.title,
      description: input.description ?? null,
      detailedDescription: input.detailedDescription ?? null,
      documentType: input.documentType,
      updatedBy: { connect: { id: updatedById } },
      ...(input.ascCenterId
        ? { ascCenter: { connect: { id: input.ascCenterId } } }
        : { ascCenter: { disconnect: true } }),
      ...(file
        ? {
            filePath: file.filePath,
            originalFileName: file.originalFileName,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
            checksum,
          }
        : {}),
    };

    return this.documentRepository.updateOneById(documentId, data);
  }

  async update(
    documentId: string,
    input: UpdateDocumentDto,
    updatedById: string,
  ) {
    await this.ensureExists(documentId);

    const data: Prisma.DocumentUpdateInput = {
      updatedBy: { connect: { id: updatedById } },
    };
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.detailedDescription !== undefined)
      data.detailedDescription = input.detailedDescription;
    if (input.documentType !== undefined)
      data.documentType = input.documentType;
    if (input.ascCenterId !== undefined) {
      data.ascCenter = input.ascCenterId
        ? { connect: { id: input.ascCenterId } }
        : { disconnect: true };
    }

    if (Object.keys(data).length === 1) {
      throw createOperationalError(
        "No fields to update",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    return this.documentRepository.updateOneById(documentId, data);
  }

  async delete(documentId: string, updatedById: string) {
    await this.ensureExists(documentId);
    await this.documentRepository.softDeleteById(documentId, updatedById);
    return { success: true as const };
  }

  async findVersions(documentId: string) {
    await this.ensureExists(documentId);
    return this.documentRepository.findVersionsByDocumentId(documentId);
  }
}
