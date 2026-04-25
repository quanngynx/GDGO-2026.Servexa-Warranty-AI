import ExcelJS from 'exceljs'

export interface ISolutionExcelService {
  buildExportWorkbook(): Promise<ExcelJS.Workbook>
  importExcel(buffer: Uint8Array, createdBy: string): Promise<{
    created: number
    errors: { row: number; message: string }[]
  }>
}
