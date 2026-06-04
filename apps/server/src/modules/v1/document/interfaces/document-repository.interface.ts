import { Prisma } from "@/core/infra/prisma/generated/client";

import type {
  DocumentFileVersionRecord,
  DocumentRecord,
} from "../document.types";

export interface IDocumentRepository {
  findMany(
    args: Prisma.DocumentFindManyArgs,
  ): Promise<DocumentRecord[] | null>;
  count(where: Prisma.DocumentWhereInput): Promise<number>;
  findById(id: string): Promise<DocumentRecord | null>;
  createOne(
    data: Prisma.DocumentCreateInput,
  ): Promise<DocumentRecord | null>;
  updateOneById(
    id: string,
    data: Prisma.DocumentUpdateInput,
  ): Promise<DocumentRecord | null>;
  softDeleteById(
    id: string,
    updatedById: string,
  ): Promise<DocumentRecord | null>;
  createVersion(
    data: Prisma.DocumentFileVersionCreateInput,
  ): Promise<DocumentFileVersionRecord | null>;
  findVersionsByDocumentId(
    documentId: string,
  ): Promise<DocumentFileVersionRecord[] | null>;
}
