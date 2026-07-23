# Design Specification: ModelExcelService Refactoring

**Date:** 2026-07-23  
**Status:** Approved by User  
**Target:** `apps/server/src/modules/v1/product-catalog/services/model-excel.service.ts`

---

## 1. Executive Summary

The `ModelExcelService` class currently combines multiple distinct concerns:
- **Document Formatting & Rendering:** Creating ExcelJS workbooks for export and template downloads.
- **Excel I/O & Header Mapping:** Parsing Uint8Array buffers, locating worksheets, mapping header columns, and normalizing cell data types.
- **Validation & Schema Enforcement:** Parsing row data using Zod (`excelImportRowSchema`) and checking for duplicates/missing reference entities.
- **Workflow Orchestration & Persistence:** Coordinating DB lookups and batch database transactions via Prisma.

This refactoring decomposes `ModelExcelService` into three single-responsibility components following **Option A**:
1. `ModelExcelWorkbookBuilder` — Pure Excel document creation, buffer loading, header extraction, and cell value normalization.
2. `ModelExcelImportParser` — Row parsing via Zod schemas, duplicate detection, and candidate model input construction.
3. `ModelExcelService` — High-level workflow orchestrator implementing `IModelExcelService`.

Existing public contracts, error handling, and API behavior will be 100% preserved.

---

## 2. Architecture & Component Boundaries

### Component Overview

```
                        +----------------------------+
                        |   IModelExcelService       |
                        +----------------------------+
                                      ^
                                      | implements
                        +----------------------------+
                        |    ModelExcelService       |
                        |      (Orchestrator)        |
                        +----------------------------+
                           /          |           \
                          /           |            \
                         v            v             v
       +-----------------------+  +------------+  +----------------------+
       | ModelExcelWorkbook-   |  | Model &    |  | ModelExcelImport-    |
       | Builder               |  | Category   |  | Parser               |
       | (Excel I/O & Format)  |  | Repos      |  | (Schema & Duplicate) |
       +-----------------------+  +------------+  +----------------------+
```

### Component Roles & Responsibilities

| Component | Responsibility | Public Methods |
|-----------|----------------|----------------|
| **`ModelExcelWorkbookBuilder`** | Excel file creation, layout, header mapping, cell value normalization | `buildExportWorkbook(rows)`, `buildTemplateWorkbook()`, `loadFirstSheet(buffer)`, `buildAndValidateHeaderMap(sheet)`, `extractRawRows(sheet, headerMap)` |
| **`ModelExcelImportParser`** | Schema parsing with Zod, internal/external duplicate checking, input record creation | `parseRowsWithSchema(rawRows)`, `buildCreateInputs(parsedRows, refs)` |
| **`ModelExcelService`** | Entry point implementation of `IModelExcelService`. Coordinates repository calls, builder, parser, and DB transactions | `buildExportWorkbook()`, `buildTemplateWorkbook()`, `importExcel(buffer)` |

---

## 3. Detailed Data Flow

### 3.1. Import Workflow (`importExcel(buffer)`)

```
User Buffer
   │
   ▼
[ModelExcelWorkbookBuilder.loadFirstSheet(buffer)]
   │
   ▼
[ModelExcelWorkbookBuilder.buildAndValidateHeaderMap(sheet)]
   │
   ▼
[ModelExcelWorkbookBuilder.extractRawRows(sheet, headerMap)]
   │
   ▼
[ModelExcelImportParser.parseRowsWithSchema(rawRows)]
   │
   ▼
[ModelExcelService.fetchReferenceSets(parsedRows)]  ──► Query DB via Repositories
   │
   ▼
[ModelExcelImportParser.buildCreateInputs(parsedRows, refs)]
   │
   ▼
[ModelExcelService.createModels(rowsToCreate)] ──► Prisma Transaction
   │
   ▼
Result: { created: number, errors: ImportError[] }
```

---

## 4. File Structure & Location

```
apps/server/src/modules/v1/product-catalog/services/
├── model-excel/
│   ├── model-excel-workbook-builder.ts   [NEW] (ExcelJS builder & reader)
│   └── model-excel-import-parser.ts      [NEW] (Zod row parser & validator)
├── model-excel.service.ts                [MODIFY] (Facade/Orchestrator)
├── model-excel.constant.ts               [UNCHANGED] (ALL_HEADERS & REQUIRED_HEADERS)
└── model-excel.type.ts                   [MODIFY] (Updated helper types)
```

---

## 5. Implementation Specifications

### 5.1. `ModelExcelWorkbookBuilder`
- Extracted methods:
  - `buildExportWorkbook(rows: ModelExportRow[])`: Returns `ExcelJS.Workbook`.
  - `buildTemplateWorkbook()`: Returns `ExcelJS.Workbook`.
  - `loadFirstSheet(buffer: Uint8Array)`: Asynchronously loads `.xlsx` buffer into `ExcelJS.Worksheet`. Throws `Workbook has no sheets` error if empty.
  - `buildAndValidateHeaderMap(sheet: ExcelJS.Worksheet)`: Maps header cells against `ALL_HEADERS`, validates `REQUIRED_HEADERS` (`modelCode`, `name`, `categoryId`), throwing operational error `Missing required column: <col>` if missing.
  - `extractRawRows(sheet, headerMap)`: Iterates rows, extracts raw normalized values via `normalizeCell()` and `getCellValue()`.

### 5.2. `ModelExcelImportParser`
- Extracted methods:
  - `parseRowsWithSchema(rawRows)`: Runs `excelImportRowSchema.safeParse()` on each row payload, returning `ParsedRow[]` and `ImportError[]`.
  - `buildCreateInputs(parsedRows, referenceSets)`: Enforces `modelCode` uniqueness (against DB `existingCodeSet` and incoming sheet `incomingCodeSet`), verifies `categoryId` against `validCategorySet`, returning `rowsToCreate` and reference errors.

### 5.3. `ModelExcelService`
- Injects or instantiates `ModelExcelWorkbookBuilder` and `ModelExcelImportParser` (defaults to new instances, supporting DI if needed).
- Delegates `buildExportWorkbook()` and `buildTemplateWorkbook()` directly to `workbookBuilder`.
- Executes high-level import pipeline in `importExcel()`.

---

## 6. Backward Compatibility & Verification

- **Interface Guarantee:** `IModelExcelService` interface remains unchanged.
- **Controller/Worker Compatibility:** `ModelController` and `product-export.worker.ts` consume `ModelExcelService` without modification.
- **Verification Plan:**
  - Execute `pnpm --filter server check-types` to confirm TypeScript type safety.
  - Execute automated server tests `pnpm --filter server test`.

---

## 7. Spec Self-Review Checklist

- [x] **Placeholder Scan:** No "TODO" or vague requirements remain.
- [x] **Consistency:** Interface method signatures and return types match existing code.
- [x] **Scope:** Refactoring is tightly scoped to `ModelExcelService` and helper modules.
- [x] **Ambiguity Check:** All method boundaries, file paths, and responsibilities are explicitly declared.
