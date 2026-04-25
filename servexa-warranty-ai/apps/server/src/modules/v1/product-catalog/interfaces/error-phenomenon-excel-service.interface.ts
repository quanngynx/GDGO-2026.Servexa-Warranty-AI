import ExcelJS from 'exceljs'

export interface IErrorPhenomenonExcelService {
  buildExportWorkbook(): Promise<ExcelJS.Workbook>
  importExcel(buffer: Uint8Array): Promise<{
    created: number
    errors: { row: number; message: string }[]
  }>
}
