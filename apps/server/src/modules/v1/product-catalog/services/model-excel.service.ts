import ExcelJS from 'exceljs'
import prisma from '@/core/infra/prisma'
import { Prisma } from '@/core/infra/prisma/generated/client'
import type { ICategoryRepository } from '../interfaces/category-repository.interface'
import type { IModelExcelService } from '../interfaces/model-excel-service.interface'
import type { IModelRepository } from '../interfaces/model-repository.interface'
import { CategoryRepository } from '../repositories/category.repository'
import { ModelRepository } from '../repositories/model.repository'
import type { ParsedRow, ReferenceSets } from './model-excel.type'
import { ModelExcelWorkbookBuilder } from './model-excel/model-excel-workbook-builder'
import { ModelExcelImportParser, type ImportModelRow } from './model-excel/model-excel-import-parser'

export type { ImportModelRow }

export class ModelExcelService implements IModelExcelService {
  constructor(
    private readonly modelRepository: IModelRepository = new ModelRepository(),
    private readonly categoryRepository: ICategoryRepository = new CategoryRepository(),
    private readonly workbookBuilder: ModelExcelWorkbookBuilder = new ModelExcelWorkbookBuilder(),
    private readonly importParser: ModelExcelImportParser = new ModelExcelImportParser(),
  ) {}

  async buildExportWorkbook(): Promise<ExcelJS.Workbook> {
    const rows = await this.modelRepository.findManyForExport()
    return this.workbookBuilder.buildExportWorkbook(rows)
  }

  async buildTemplateWorkbook(): Promise<ExcelJS.Workbook> {
    return this.workbookBuilder.buildTemplateWorkbook()
  }

  async importExcel(buffer: Uint8Array): Promise<{
    created: number
    errors: { row: number; message: string }[]
  }> {
    const sheet = await this.workbookBuilder.loadFirstSheet(buffer)
    const headerMap = this.workbookBuilder.buildAndValidateHeaderMap(sheet)
    const parseResult = this.importParser.parseRows(sheet, headerMap, this.workbookBuilder)
    const errors = [...parseResult.errors]

    if (parseResult.parsedRows.length === 0) {
      return { created: 0, errors }
    }

    const refs = await this.fetchReferenceSets(parseResult.parsedRows)
    const buildResult = this.importParser.buildCreateInputs(parseResult.parsedRows, refs)
    errors.push(...buildResult.errors)

    if (buildResult.rowsToCreate.length === 0) {
      return { created: 0, errors }
    }

    const created = await this.createModels(buildResult.rowsToCreate)
    return { created, errors }
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
