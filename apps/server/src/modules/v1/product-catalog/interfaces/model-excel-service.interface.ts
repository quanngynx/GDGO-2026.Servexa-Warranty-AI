import ExcelJS from 'exceljs'

export interface IModelExcelService {
  buildExportWorkbook(): Promise<ExcelJS.Workbook>
  buildTemplateWorkbook(): Promise<ExcelJS.Workbook>
  importExcel(buffer: Uint8Array): Promise<{
    created: number
    errors: { row: number; message: string }[]
  }>
}
