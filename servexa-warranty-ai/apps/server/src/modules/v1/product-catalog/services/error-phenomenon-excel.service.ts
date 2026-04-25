import ExcelJS from "exceljs";
import { Prisma } from "@servexa-warranty-ai/db/prisma/client";
import z from "zod";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";

import type { IErrorPhenomenonExcelService } from "../interfaces/error-phenomenon-excel-service.interface";
import type { IErrorPhenomenonRepository } from "../interfaces/error-phenomenon-repository.interface";
import { ErrorPhenomenonRepository } from "../repositories/error-phenomenon.repository";
import { excelImportErrorPhenomenonRowSchema } from "../validations/error-phenomenon";

export type ImportErrorPhenomenonRow = z.infer<
  typeof excelImportErrorPhenomenonRowSchema
>;

const REQUIRED_HEADERS = [
  "name",
  "categoryId",
  "description",
  "status",
] as const;
type ImportHeader = (typeof REQUIRED_HEADERS)[number];

type HeaderMap = Map<ImportHeader, number>;

type ParsedRow = {
  row: number;
  data: ImportErrorPhenomenonRow;
};

type ParseRowsResult = {
  parsedRows: ParsedRow[];
  errors: { row: number; message: string }[];
};

export class ErrorPhenomenonExcelService implements IErrorPhenomenonExcelService {
  constructor(
    private readonly errorPhenomenonRepository: IErrorPhenomenonRepository = new ErrorPhenomenonRepository(),
  ) {}

  async buildExportWorkbook() {
    const rows = (await this.errorPhenomenonRepository.findAll({
      select: {
        id: true,
        categoryId: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as any[];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("ErrorPhenomena");

    sheet.columns = [
      { header: "id", key: "id", width: 38 },
      { header: "categoryId", key: "categoryId", width: 38 },
      { header: "name", key: "name", width: 28 },
      { header: "description", key: "description", width: 38 },
      { header: "status", key: "status", width: 12 },
      { header: "createdAt", key: "createdAt", width: 24 },
      { header: "updatedAt", key: "updatedAt", width: 24 },
    ];

    for (const row of rows) {
      sheet.addRow({
        id: row.id,
        categoryId: row.categoryId ?? "",
        name: row.name,
        description: row.description ?? "",
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      });
    }

    return workbook;
  }

  async importExcel(buffer: Uint8Array): Promise<{
    created: number;
    errors: { row: number; message: string }[];
  }> {
    const sheet = await this.loadFirstSheet(buffer);
    const headerMap = this.buildAndValidateHeaderMap(sheet);
    const parseResult = this.parseRows(sheet, headerMap);
    const errors = [...parseResult.errors];

    if (parseResult.parsedRows.length === 0) {
      return { created: 0, errors };
    }

    const { existingPairs } = await this.fetchReferenceSets();
    const buildResult = this.buildCreateInputs(
      parseResult.parsedRows,
      existingPairs,
    );
    errors.push(...buildResult.errors);

    if (buildResult.rowsToCreate.length === 0) {
      return { created: 0, errors };
    }

    const created = await this.createErrorPhenomena(buildResult.rowsToCreate);
    return { created, errors };
  }

  private async loadFirstSheet(buffer: Uint8Array): Promise<ExcelJS.Worksheet> {
    const workbook = new ExcelJS.Workbook();
    const nodeBuffer = Buffer.from(buffer);
    const loadXlsx = workbook.xlsx.load as unknown as (
      data: Uint8Array,
    ) => Promise<void>;
    await loadXlsx(nodeBuffer);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      throw createOperationalError(
        "Workbook has no sheets",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    return sheet;
  }

  private buildAndValidateHeaderMap(sheet: ExcelJS.Worksheet): HeaderMap {
    const headerRow = sheet.getRow(1);
    const headerMap = new Map<ImportHeader, number>();
    headerRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
      const key = String(cell.value ?? "").trim();
      if (key && REQUIRED_HEADERS.includes(key as ImportHeader)) {
        headerMap.set(key as ImportHeader, colNumber);
      }
    });

    for (const h of REQUIRED_HEADERS) {
      if (!headerMap.has(h)) {
        throw createOperationalError(
          `Missing column: ${h}`,
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
      }
    }

    return headerMap;
  }

  private getCellValue(
    sheet: ExcelJS.Worksheet,
    rowIndex: number,
    headerMap: HeaderMap,
    header: ImportHeader,
  ): unknown {
    const col = headerMap.get(header);
    if (col === undefined) return undefined;
    return sheet.getRow(rowIndex).getCell(col).value;
  }

  private normalizeCell(value: unknown): string | number | Date | null {
    if (value === null || value === undefined) return "";
    if (typeof value === "object" && value !== null && "text" in value) {
      const rich = value as { text: string };
      return rich.text;
    }
    if (typeof value === "object" && value !== null && "result" in value) {
      const formula = value as { result: unknown };
      return this.normalizeCell(formula.result);
    }
    if (value instanceof Date) return value;
    if (typeof value === "number") return value;
    return String(value).trim();
  }

  private parseRows(
    sheet: ExcelJS.Worksheet,
    headerMap: HeaderMap,
  ): ParseRowsResult {
    const errors: { row: number; message: string }[] = [];
    const parsedRows: ParsedRow[] = [];

    for (let r = 2; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r);
      if (!row.hasValues) continue;

      const raw = {
        name: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "name"),
        ),
        categoryId: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "categoryId"),
        ),
        description: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "description"),
        ),
        status: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "status"),
        ),
      };

      const isEmptyRow =
        String(raw.name) === "" && String(raw.categoryId) === "";

      if (isEmptyRow) continue;

      const statusStr = String(raw.status).trim();
      const payload = {
        name: String(raw.name),
        categoryId:
          String(raw.categoryId) === "" ? undefined : String(raw.categoryId),
        description:
          String(raw.description) === "" ? undefined : String(raw.description),
        status: statusStr === "" ? undefined : statusStr,
      };

      const parsed = excelImportErrorPhenomenonRowSchema.safeParse(payload);
      if (!parsed.success) {
        const message = parsed.error.issues
          .map((issue) => issue.message)
          .join("; ");
        errors.push({ row: r, message });
        continue;
      }

      parsedRows.push({ row: r, data: parsed.data });
    }

    return { parsedRows, errors };
  }

  private async fetchReferenceSets() {
    // Unique pairs of categoryId and name

    const existingEntities = (await this.errorPhenomenonRepository.findAll({
      select: { categoryId: true, name: true },
    })) as { categoryId: string | null; name: string }[];

    const existingPairs = new Set(
      existingEntities.map(
        (item) => `${item.categoryId || "null"}-${item.name}`,
      ),
    );

    return { existingPairs };
  }

  private buildCreateInputs(
    parsedRows: ParsedRow[],
    existingPairs: Set<string>,
  ) {
    const incomingPairs = new Set<string>();
    const rowsToCreate: Prisma.ErrorPhenomenonCreateManyInput[] = [];
    const errors: { row: number; message: string }[] = [];

    for (const entry of parsedRows) {
      const pairKey = `${entry.data.categoryId || "null"}-${entry.data.name}`;

      if (existingPairs.has(pairKey) || incomingPairs.has(pairKey)) {
        errors.push({
          row: entry.row,
          message: `Duplicate (categoryId, name) pair: ${pairKey}`,
        });
        continue;
      }

      incomingPairs.add(pairKey);

      rowsToCreate.push({
        name: entry.data.name,
        categoryId: entry.data.categoryId ?? null,
        description: entry.data.description ?? null,
        status: entry.data.status ?? "active",
      });
    }

    return { rowsToCreate, errors };
  }

  private async createErrorPhenomena(
    rows: Prisma.ErrorPhenomenonCreateManyInput[],
  ): Promise<number> {
    const createdRows =
      await this.errorPhenomenonRepository.createManyAndReturn(rows);
    return createdRows.length;
  }
}
