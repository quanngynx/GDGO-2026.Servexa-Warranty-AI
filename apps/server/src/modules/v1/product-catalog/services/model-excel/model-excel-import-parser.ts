import ExcelJS from 'exceljs'
import { Prisma } from '@/core/infra/prisma/generated/client'
import z from 'zod'
import { excelImportRowSchema } from '../../validations/model'
import type { BuildCreateInputsResult, HeaderMap, ImportError, ParsedRow, ParseRowsResult, ReferenceSets } from '../model-excel.type'
import type { ModelExcelWorkbookBuilder } from './model-excel-workbook-builder'

export type ImportModelRow = z.infer<typeof excelImportRowSchema>

export class ModelExcelImportParser {
  parseRows(
    sheet: ExcelJS.Worksheet,
    headerMap: HeaderMap,
    workbookBuilder: ModelExcelWorkbookBuilder
  ): ParseRowsResult {
    const errors: ImportError[] = []
    const parsedRows: ParsedRow[] = []

    for (let r = 2; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r)
      if (!row.hasValues) continue

      const raw = {
        modelCode: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'modelCode')),
        name: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'name')),
        categoryId: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'categoryId')),
        status: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'status')),
        laborCost: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'laborCost')),
        inspectionCost: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'inspectionCost')),
        stockNumber: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'stockNumber')),
        image: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'image')),
        createdAt: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'createdAt')),
        updatedAt: workbookBuilder.normalizeCell(workbookBuilder.getCellValue(sheet, r, headerMap, 'updatedAt')),
      }

      const isEmptyRow =
        String(raw.modelCode) === '' &&
        String(raw.name) === '' &&
        String(raw.categoryId) === ''

      if (isEmptyRow) continue

      const statusStr = String(raw.status).trim()
      const payload = {
        modelCode: String(raw.modelCode),
        name: String(raw.name),
        categoryId: String(raw.categoryId),
        status: statusStr === '' ? undefined : statusStr,
        laborCost:
          raw.laborCost === '' || raw.laborCost === null ? undefined : Number(raw.laborCost),
        inspectionCost:
          raw.inspectionCost === '' || raw.inspectionCost === null
            ? undefined
            : Number(raw.inspectionCost),
        stockNumber:
          raw.stockNumber === '' || raw.stockNumber === null ? undefined : Number(raw.stockNumber),
        image: String(raw.image) === '' ? undefined : String(raw.image),
        createdAt: raw.createdAt === '' || raw.createdAt === null ? undefined : raw.createdAt,
        updatedAt: raw.updatedAt === '' || raw.updatedAt === null ? undefined : raw.updatedAt,
      }

      const parsed = excelImportRowSchema.safeParse(payload)
      if (!parsed.success) {
        const message = parsed.error.issues.map((issue: z.ZodIssue) => issue.message).join('; ')
        errors.push({ row: r, message })
        continue
      }

      parsedRows.push({ row: r, data: parsed.data })
    }

    return { parsedRows, errors }
  }

  buildCreateInputs(parsedRows: ParsedRow[], refs: ReferenceSets): BuildCreateInputsResult {
    const incomingCodeSet = new Set<string>()
    const rowsToCreate: Prisma.ModelCreateManyInput[] = []
    const errors: ImportError[] = []

    for (const entry of parsedRows) {
      if (
        refs.existingCodeSet.has(entry.data.modelCode) ||
        incomingCodeSet.has(entry.data.modelCode)
      ) {
        errors.push({ row: entry.row, message: `Duplicate modelCode: ${entry.data.modelCode}` })
        continue
      }

      if (!refs.validCategorySet.has(entry.data.categoryId)) {
        errors.push({ row: entry.row, message: 'Category not found' })
        continue
      }

      incomingCodeSet.add(entry.data.modelCode)

      rowsToCreate.push({
        modelCode: entry.data.modelCode,
        name: entry.data.name,
        categoryId: entry.data.categoryId,
        image: entry.data.image ?? null,
        status: entry.data.status ?? 'active',
        stockNumber: entry.data.stockNumber ?? 0,
        laborCost:
          entry.data.laborCost === undefined || entry.data.laborCost === null
            ? null
            : new Prisma.Decimal(entry.data.laborCost),
        inspectionCost:
          entry.data.inspectionCost === undefined || entry.data.inspectionCost === null
            ? null
            : new Prisma.Decimal(entry.data.inspectionCost),
        createdAt: entry.data.createdAt,
        updatedAt: entry.data.updatedAt,
      })
    }

    return { rowsToCreate, errors }
  }
}
