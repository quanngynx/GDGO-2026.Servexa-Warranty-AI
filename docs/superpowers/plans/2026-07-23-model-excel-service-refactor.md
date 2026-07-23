# ModelExcelService Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Decompose `ModelExcelService` into three single-responsibility components (`ModelExcelWorkbookBuilder`, `ModelExcelImportParser`, and `ModelExcelService` orchestrator) to improve modularity, maintainability, and unit testability without altering existing external behavior or API contracts.

**Architecture:** 
- `ModelExcelWorkbookBuilder` handles ExcelJS rendering, sheet parsing, header mapping, and raw cell normalization.
- `ModelExcelImportParser` handles Zod schema validation, duplicate `modelCode` checking, and Prisma `ModelCreateManyInput` preparation.
- `ModelExcelService` orchestrates the workflow, delegating I/O and validation to the builder/parser while managing repository lookups and Prisma transactions.

**Tech Stack:** TypeScript, ExcelJS, Zod, Prisma, Express, Vitest/Jest.

## Global Constraints

- Preserve `IModelExcelService` interface contract verbatim.
- Required import headers: `modelCode`, `name`, `categoryId`.
- Optional import headers: `status`, `laborCost`, `inspectionCost`, `stockNumber`, `image`, `createdAt`, `updatedAt`.
- Maintain operational error message format for header failures: `Missing required column: <col>` (or `Workbook has no sheets`).
- All code must pass `pnpm --filter server check-types`.

---

### Task 1: Create `ModelExcelWorkbookBuilder`

**Files:**
- Create: `apps/server/src/modules/v1/product-catalog/services/model-excel/model-excel-workbook-builder.ts`
- Test: `apps/server/src/modules/v1/product-catalog/services/model-excel/__tests__/model-excel-workbook-builder.test.ts`

**Interfaces:**
- Consumes: `ExcelJS.Workbook`, `ExcelJS.Worksheet`, `ALL_HEADERS`, `REQUIRED_HEADERS` from `../model-excel.constant`.
- Produces: `ModelExcelWorkbookBuilder` class with `buildExportWorkbook()`, `buildTemplateWorkbook()`, `loadFirstSheet()`, `buildAndValidateHeaderMap()`, `extractRawRows()`.

- [ ] **Step 1: Write unit tests for `ModelExcelWorkbookBuilder`**

```ts
import { describe, it, expect } from 'vitest'
import ExcelJS from 'exceljs'
import { ModelExcelWorkbookBuilder } from '../model-excel-workbook-builder'

describe('ModelExcelWorkbookBuilder', () => {
  const builder = new ModelExcelWorkbookBuilder()

  it('should build export workbook with correct columns', async () => {
    const workbook = await builder.buildExportWorkbook([
      {
        modelCode: 'MOD-001',
        name: 'Model 1',
        categoryId: 'cat-1',
        status: 'active',
        laborCost: 100,
        inspectionCost: 50,
        stockNumber: 10,
        image: 'img.png',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ])
    const sheet = workbook.getWorksheet('Models')
    expect(sheet).toBeDefined()
    expect(sheet?.rowCount).toBe(2)
  })

  it('should build template workbook with sample row', async () => {
    const workbook = await builder.buildTemplateWorkbook()
    const sheet = workbook.getWorksheet('Models_Import_Template')
    expect(sheet).toBeDefined()
    expect(sheet?.rowCount).toBe(2)
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `pnpm --filter server test apps/server/src/modules/v1/product-catalog/services/model-excel/__tests__/model-excel-workbook-builder.test.ts`
Expected: FAIL with "Cannot find module '../model-excel-workbook-builder'"

- [ ] **Step 3: Implement `ModelExcelWorkbookBuilder`**

```ts
import ExcelJS from 'exceljs'
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter server check-types`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add apps/server/src/modules/v1/product-catalog/services/model-excel/model-excel-workbook-builder.ts
git commit -m "feat(product-catalog): add ModelExcelWorkbookBuilder"
```

---

### Task 2: Create `ModelExcelImportParser`

**Files:**
- Create: `apps/server/src/modules/v1/product-catalog/services/model-excel/model-excel-import-parser.ts`
- Test: `apps/server/src/modules/v1/product-catalog/services/model-excel/__tests__/model-excel-import-parser.test.ts`

**Interfaces:**
- Consumes: `excelImportRowSchema`, `ParsedRow`, `ReferenceSets`, `HeaderMap`, `ModelExcelWorkbookBuilder`.
- Produces: `ModelExcelImportParser` class with `parseRows()`, `buildCreateInputs()`.

- [ ] **Step 1: Write unit tests for `ModelExcelImportParser`**

```ts
import { describe, it, expect } from 'vitest'
import { ModelExcelImportParser } from '../model-excel-import-parser'

describe('ModelExcelImportParser', () => {
  const parser = new ModelExcelImportParser()

  it('should detect duplicate modelCode', () => {
    const parsedRows = [
      {
        row: 2,
        data: {
          modelCode: 'MOD-DUP',
          name: 'Model DUP',
          categoryId: '019f8dfa-533b-7285-817d-31ca23d08307',
        },
      },
    ]
    const refs = {
      existingCodeSet: new Set(['MOD-DUP']),
      validCategorySet: new Set(['019f8dfa-533b-7285-817d-31ca23d08307']),
    }
    const result = parser.buildCreateInputs(parsedRows, refs)
    expect(result.rowsToCreate.length).toBe(0)
    expect(result.errors[0]?.message).toContain('Duplicate modelCode')
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `pnpm --filter server check-types`
Expected: FAIL with missing module error.

- [ ] **Step 3: Implement `ModelExcelImportParser`**

```ts
import ExcelJS from 'exceljs'
import { Prisma } from '@/core/infra/prisma/generated/client'
import { excelImportRowSchema } from '../../validations/model'
import type { BuildCreateInputsResult, HeaderMap, ImportError, ParsedRow, ParseRowsResult, ReferenceSets } from '../model-excel.type'
import type { ModelExcelWorkbookBuilder } from './model-excel-workbook-builder'

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
        const message = parsed.error.issues.map((issue) => issue.message).join('; ')
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
```

- [ ] **Step 4: Run typecheck to verify implementation**

Run: `pnpm --filter server check-types`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add apps/server/src/modules/v1/product-catalog/services/model-excel/model-excel-import-parser.ts
git commit -m "feat(product-catalog): add ModelExcelImportParser"
```

---

### Task 3: Refactor `ModelExcelService` Orchestrator

**Files:**
- Modify: `apps/server/src/modules/v1/product-catalog/services/model-excel.service.ts`

**Interfaces:**
- Consumes: `ModelExcelWorkbookBuilder`, `ModelExcelImportParser`, `IModelRepository`, `ICategoryRepository`.
- Produces: Refactored `ModelExcelService` implementing `IModelExcelService`.

- [ ] **Step 1: Refactor `ModelExcelService` to delegate to builder & parser**

```ts
import ExcelJS from 'exceljs'
import prisma from '@/core/infra/prisma'
import type { ICategoryRepository } from '../interfaces/category-repository.interface'
import type { IModelExcelService } from '../interfaces/model-excel-service.interface'
import type { IModelRepository } from '../interfaces/model-repository.interface'
import { CategoryRepository } from '../repositories/category.repository'
import { ModelRepository } from '../repositories/model.repository'
import type { ParsedRow, ReferenceSets } from './model-excel.type'
import { ModelExcelWorkbookBuilder } from './model-excel/model-excel-workbook-builder'
import { ModelExcelImportParser } from './model-excel/model-excel-import-parser'

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
```

- [ ] **Step 2: Run TypeScript check to verify zero compilation errors**

Run: `pnpm --filter server check-types`
Expected: PASS with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add apps/server/src/modules/v1/product-catalog/services/model-excel.service.ts
git commit -m "refactor(product-catalog): delegate ModelExcelService tasks to WorkbookBuilder and ImportParser"
```

---

### Task 4: Verification and Final Sanity Checks

- [ ] **Step 1: Run full server TypeScript check**

Run: `pnpm --filter server check-types`
Expected: PASS with 0 errors.

- [ ] **Step 2: Commit all remaining changes and verify git workspace is clean**

Run: `git status`
Expected: `nothing to commit, working tree clean`.
