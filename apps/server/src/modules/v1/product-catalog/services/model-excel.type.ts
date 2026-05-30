import { Prisma } from '@servexa-warranty-ai/db/prisma/client'
import type { ImportModelRow } from '..';

export type ImportError = { row: number; message: string }
export type ParsedRow = { row: number; data: ImportModelRow }
export type ParseRowsResult = { parsedRows: ParsedRow[]; errors: ImportError[] }
export type ReferenceSets = { existingCodeSet: Set<string>; validCategorySet: Set<string> }
export type BuildCreateInputsResult = { rowsToCreate: Prisma.ModelCreateManyInput[]; errors: ImportError[] }
export type ImportHeader =
  | 'modelCode'
  | 'name'
  | 'categoryId'
  | 'status'
  | 'laborCost'
  | 'inspectionCost'
  | 'stockNumber'
  | 'image'
  | 'createdAt'
  | 'updatedAt'
export type HeaderMap = Map<ImportHeader, number>