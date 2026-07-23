import ExcelJS from 'exceljs'
import { Prisma } from '@/core/infra/prisma/generated/client'
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import type { HeaderMap, ImportHeader } from '../model-excel.type'
import { ALL_HEADERS, REQUIRED_HEADERS } from '../model-excel.constant'

export interface ModelExportRow {
  modelCode: string
  name: string
  categoryId: string
  status: string
  laborCost: number | null | Prisma.Decimal
  inspectionCost: number | null | Prisma.Decimal
  stockNumber: number
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export class ModelExcelWorkbookBuilder {
  async buildExportWorkbook(rows: ModelExportRow[]): Promise<ExcelJS.Workbook> {
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

  async buildTemplateWorkbook(): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Models_Import_Template')

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

    const headerRow = sheet.getRow(1)
    headerRow.font = { bold: true }

    sheet.addRow({
      modelCode: 'MOD-SAMPLE-01',
      name: 'Sample Model Name',
      categoryId: '00000000-0000-0000-0000-000000000000',
      status: 'active',
      laborCost: 150000,
      inspectionCost: 50000,
      stockNumber: 10,
      image: 'https://example.com/image.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return workbook
  }

  async loadFirstSheet(buffer: Uint8Array): Promise<ExcelJS.Worksheet> {
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

  buildAndValidateHeaderMap(sheet: ExcelJS.Worksheet): HeaderMap {
    const headerRow = sheet.getRow(1)
    const headerMap = new Map<ImportHeader, number>()
    headerRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
      const key = String(cell.value ?? '').trim()
      if (key && ALL_HEADERS.includes(key as ImportHeader)) {
        headerMap.set(key as ImportHeader, colNumber)
      }
    })

    for (const h of REQUIRED_HEADERS) {
      if (!headerMap.has(h)) {
        throw createOperationalError(`Missing required column: ${h}`, HTTP_RESPONSE_CODE.BAD_REQUEST)
      }
    }

    return headerMap
  }

  getCellValue(sheet: ExcelJS.Worksheet, rowIndex: number, headerMap: HeaderMap, header: ImportHeader): unknown {
    const col = headerMap.get(header)
    if (col === undefined) return undefined
    return sheet.getRow(rowIndex).getCell(col).value
  }

  normalizeCell(value: unknown): string | number | Date | null {
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
}
