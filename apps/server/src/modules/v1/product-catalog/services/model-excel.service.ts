import ExcelJS from 'exceljs'
import prisma from '@/core/infra/prisma'
import { Prisma } from '@/core/infra/prisma/generated/client'
import z from 'zod'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'

import type { ICategoryRepository } from '../interfaces/category-repository.interface'
import type { IModelExcelService } from '../interfaces/model-excel-service.interface'
import type { IModelRepository } from '../interfaces/model-repository.interface'
import { CategoryRepository } from '../repositories/category.repository'
import { ModelRepository } from '../repositories/model.repository'
import { excelImportRowSchema } from '../validations/model'
import type { BuildCreateInputsResult, HeaderMap, ImportError, ImportHeader, ParsedRow, ParseRowsResult, ReferenceSets } from './model-excel.type'
import { REQUIRED_HEADERS } from './model-excel.constant'

export type ImportModelRow = z.infer<typeof excelImportRowSchema>

export class ModelExcelService implements IModelExcelService {
  constructor(
    private readonly modelRepository: IModelRepository = new ModelRepository(),
    private readonly categoryRepository: ICategoryRepository = new CategoryRepository(),
  ) {}

  async buildExportWorkbook() {
    const rows = await this.modelRepository.findManyForExport()
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Models')

    sheet.columns = [
      { header: 'modelCode', key: 'modelCode', width: 18 },
      { header: 'name', key: 'name', width: 28 },
      { header: 'categoryId', key: 'categoryId', width: 38 },
      { header: 'status', key: 'status', width: 12 },
      { header: 'laborCost', key: 'laborCost', width: 12 },
      { header: 'inspectionCost', key: 'inspectionCost', width: 14 },
      { header: 'stockNumber', key: 'stockNumber', width: 12 },
      { header: 'image', key: 'image', width: 36 },
      { header: 'createdAt', key: 'createdAt', width: 24 },
      { header: 'updatedAt', key: 'updatedAt', width: 24 },
    ]

    for (const row of rows) {
      sheet.addRow({
        modelCode: row.modelCode,
        name: row.name,
        categoryId: row.categoryId,
        status: row.status,
        laborCost: row.laborCost !== null ? Number(row.laborCost) : '',
        inspectionCost: row.inspectionCost !== null ? Number(row.inspectionCost) : '',
        stockNumber: row.stockNumber,
        image: row.image ?? '',
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })
    }

    return workbook
  }

  async importExcel(buffer: Uint8Array): Promise<{
    created: number
    errors: { row: number; message: string }[]
  }> {
    const sheet = await this.loadFirstSheet(buffer)
    const headerMap = this.buildAndValidateHeaderMap(sheet)
    const parseResult = this.parseRows(sheet, headerMap)
    const errors = [...parseResult.errors]

    if (parseResult.parsedRows.length === 0) {
      return { created: 0, errors }
    }

    const refs = await this.fetchReferenceSets(parseResult.parsedRows)
    const buildResult = this.buildCreateInputs(parseResult.parsedRows, refs)
    errors.push(...buildResult.errors)

    if (buildResult.rowsToCreate.length === 0) {
      return { created: 0, errors }
    }

    const created = await this.createModels(buildResult.rowsToCreate)
    return { created, errors }
  }

  private async loadFirstSheet(buffer: Uint8Array): Promise<ExcelJS.Worksheet> {
    const workbook = new ExcelJS.Workbook()
    const nodeBuffer = Buffer.from(buffer)
    const loadXlsx = workbook.xlsx.load as unknown as (data: Uint8Array) => Promise<void>
    await loadXlsx(nodeBuffer)

    const sheet = workbook.worksheets[0]
    if (!sheet) {
      throw createOperationalError('Workbook has no sheets', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return sheet
  }

  private buildAndValidateHeaderMap(sheet: ExcelJS.Worksheet): HeaderMap {
    const headerRow = sheet.getRow(1)
    const headerMap = new Map<ImportHeader, number>()
    headerRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
      const key = String(cell.value ?? '').trim()
      if (key && REQUIRED_HEADERS.includes(key as ImportHeader)) {
        headerMap.set(key as ImportHeader, colNumber)
      }
    })

    for (const h of REQUIRED_HEADERS) {
      if (!headerMap.has(h)) {
        throw createOperationalError(`Missing column: ${h}`, HTTP_RESPONSE_CODE.BAD_REQUEST)
      }
    }

    return headerMap
  }

  private getCellValue(sheet: ExcelJS.Worksheet, rowIndex: number, headerMap: HeaderMap, header: ImportHeader): unknown {
    const col = headerMap.get(header)
    if (col === undefined) return undefined
    return sheet.getRow(rowIndex).getCell(col).value
  }

  private normalizeCell(value: unknown): string | number | Date | null {
    if (value === null || value === undefined) return ''
    if (typeof value === 'object' && value !== null && 'text' in value) {
      const rich = value as { text: string }
      return rich.text
    }
    if (typeof value === 'object' && value !== null && 'result' in value) {
      const formula = value as { result: unknown }
      return this.normalizeCell(formula.result)
    }
    if (value instanceof Date) return value
    if (typeof value === 'number') return value
    return String(value).trim()
  }

  private parseRows(sheet: ExcelJS.Worksheet, headerMap: HeaderMap): ParseRowsResult {
    const errors: ImportError[] = []
    const parsedRows: ParsedRow[] = []

    for (let r = 2; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r)
      if (!row.hasValues) continue

      const raw = {
        modelCode: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'modelCode')),
        name: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'name')),
        categoryId: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'categoryId')),
        status: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'status')),
        laborCost: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'laborCost')),
        inspectionCost: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'inspectionCost')),
        stockNumber: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'stockNumber')),
        image: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'image')),
        createdAt: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'createdAt')),
        updatedAt: this.normalizeCell(this.getCellValue(sheet, r, headerMap, 'updatedAt')),
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
        const message = parsed.error.issues.map((issue) => issue.message).join('; ')
        errors.push({ row: r, message })
        continue
      }

      parsedRows.push({ row: r, data: parsed.data })
    }

    return { parsedRows, errors }
  }

  private async fetchReferenceSets(parsedRows: ParsedRow[]): Promise<ReferenceSets> {
    const modelCodes = Array.from(new Set(parsedRows.map((entry) => entry.data.modelCode)))
    const categoryIds = Array.from(new Set(parsedRows.map((entry) => entry.data.categoryId)))

    const [existingModels, existingCategories] = await Promise.all([
      this.modelRepository.findAll({
        where: { modelCode: { in: modelCodes } },
        select: { modelCode: true },
      }),
      this.categoryRepository.findAll({
        where: { id: { in: categoryIds } },
        select: { id: true },
      }),
    ])

    return {
      existingCodeSet: new Set(
        (existingModels as { modelCode: string }[]).map((item) => item.modelCode),
      ),
      validCategorySet: new Set(
        (existingCategories as { id: string }[]).map((item) => item.id),
      ),
    }
  }

  private buildCreateInputs(parsedRows: ParsedRow[], refs: ReferenceSets): BuildCreateInputsResult {
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

  private async createModels(rows: Prisma.ModelCreateManyInput[]): Promise<number> {
    const createdRows = await prisma.$transaction((tx) =>
      tx.model.createManyAndReturn({
        data: rows,
        select: { id: true },
      }),
    )

    return createdRows.length
  }
}
