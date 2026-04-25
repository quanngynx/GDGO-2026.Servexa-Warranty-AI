import ExcelJS from "exceljs";
import { Prisma } from "@servexa-warranty-ai/db/prisma/client";
import z from "zod";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";

import type { ISolutionExcelService } from "../interfaces/solution-excel-service.interface";
import type { ISolutionRepository } from "../interfaces/solution-repository.interface";
import { SolutionRepository } from "../repositories/solution.repository";
import { excelImportSolutionRowSchema } from "../validations/solution";

export type ImportSolutionRow = z.infer<typeof excelImportSolutionRowSchema>;

const REQUIRED_HEADERS = [
  "name",
  "description",
  "instructions",
  "estimatedTime",
  "difficulty",
  "requiredTools",
  "requiredParts",
  "status",
] as const;
type ImportHeader = (typeof REQUIRED_HEADERS)[number];

type HeaderMap = Map<ImportHeader, number>;

type ParsedRow = {
  row: number;
  data: ImportSolutionRow;
};

type ParseRowsResult = {
  parsedRows: ParsedRow[];
  errors: { row: number; message: string }[];
};

export class SolutionExcelService implements ISolutionExcelService {
  constructor(
    private readonly solutionRepository: ISolutionRepository = new SolutionRepository(),
  ) {}

  async buildExportWorkbook() {
    const rows = (await this.solutionRepository.findAll({
      select: {
        id: true,
        name: true,
        description: true,
        instructions: true,
        estimatedTime: true,
        difficulty: true,
        requiredTools: true,
        requiredParts: true,
        status: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as any[];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Solutions");

    sheet.columns = [
      { header: "id", key: "id", width: 38 },
      { header: "name", key: "name", width: 28 },
      { header: "description", key: "description", width: 38 },
      { header: "instructions", key: "instructions", width: 50 },
      { header: "estimatedTime", key: "estimatedTime", width: 15 },
      { header: "difficulty", key: "difficulty", width: 15 },
      { header: "requiredTools", key: "requiredTools", width: 38 },
      { header: "requiredParts", key: "requiredParts", width: 38 },
      { header: "status", key: "status", width: 12 },
      { header: "createdBy", key: "createdBy", width: 38 },
      { header: "createdAt", key: "createdAt", width: 24 },
      { header: "updatedAt", key: "updatedAt", width: 24 },
    ];

    for (const row of rows) {
      sheet.addRow({
        id: row.id,
        name: row.name,
        description: row.description ?? "",
        instructions: row.instructions,
        estimatedTime: row.estimatedTime ?? "",
        difficulty: row.difficulty,
        requiredTools: row.requiredTools ?? "",
        requiredParts: row.requiredParts ?? "",
        status: row.status,
        createdBy: row.createdBy,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      });
    }

    return workbook;
  }

  async importExcel(
    buffer: Uint8Array,
    createdBy: string,
  ): Promise<{
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

    // According to the plan: "for solution: decide whether name must be unique; if not, skip DB-dupe check and only validate required fields"
    // I will skip db-dupe check, but just build the inputs.
    const buildResult = this.buildCreateInputs(
      parseResult.parsedRows,
      createdBy,
    );
    errors.push(...buildResult.errors);

    if (buildResult.rowsToCreate.length === 0) {
      return { created: 0, errors };
    }

    const created = await this.createSolutions(buildResult.rowsToCreate);
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
        description: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "description"),
        ),
        instructions: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "instructions"),
        ),
        estimatedTime: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "estimatedTime"),
        ),
        difficulty: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "difficulty"),
        ),
        requiredTools: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "requiredTools"),
        ),
        requiredParts: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "requiredParts"),
        ),
        status: this.normalizeCell(
          this.getCellValue(sheet, r, headerMap, "status"),
        ),
      };

      const isEmptyRow =
        String(raw.name) === "" && String(raw.instructions) === "";

      if (isEmptyRow) continue;

      const statusStr = String(raw.status).trim();
      const difficultyStr = String(raw.difficulty).trim();

      const payload = {
        name: String(raw.name),
        description:
          String(raw.description) === "" ? undefined : String(raw.description),
        instructions: String(raw.instructions),
        estimatedTime:
          raw.estimatedTime === "" || raw.estimatedTime === null
            ? undefined
            : Number(raw.estimatedTime),
        difficulty: difficultyStr === "" ? undefined : difficultyStr,
        requiredTools:
          String(raw.requiredTools) === ""
            ? undefined
            : String(raw.requiredTools),
        requiredParts:
          String(raw.requiredParts) === ""
            ? undefined
            : String(raw.requiredParts),
        status: statusStr === "" ? undefined : statusStr,
      };

      const parsed = excelImportSolutionRowSchema.safeParse(payload);
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

  private buildCreateInputs(parsedRows: ParsedRow[], createdBy: string) {
    const rowsToCreate: Prisma.SolutionCreateManyInput[] = [];
    const errors: { row: number; message: string }[] = [];

    for (const entry of parsedRows) {
      rowsToCreate.push({
        name: entry.data.name,
        description: entry.data.description ?? null,
        instructions: entry.data.instructions,
        estimatedTime: entry.data.estimatedTime ?? null,
        difficulty: entry.data.difficulty ?? "medium",
        requiredTools: entry.data.requiredTools ?? null,
        requiredParts: entry.data.requiredParts ?? null,
        status: entry.data.status ?? "active",
        createdBy,
      });
    }

    return { rowsToCreate, errors };
  }

  private async createSolutions(
    rows: Prisma.SolutionCreateManyInput[],
  ): Promise<number> {
    const createdRows = await this.solutionRepository.createManyAndReturn(rows);
    return createdRows.length;
  }
}
