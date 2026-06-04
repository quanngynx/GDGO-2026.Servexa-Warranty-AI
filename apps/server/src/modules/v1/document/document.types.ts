import { Prisma } from "@/core/infra/prisma/generated/client";

export const documentRecordSelect = {
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

export type DocumentRecord = Prisma.DocumentGetPayload<{
  select: typeof documentRecordSelect;
}>;

export type DocumentFileVersionRecord = Prisma.DocumentFileVersionGetPayload<
  Record<string, never>
>;
