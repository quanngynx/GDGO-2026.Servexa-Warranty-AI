import ExcelJS from "exceljs";
import type { RepairCaseDetail } from "../dtos/repair-case.dto";

export class RepairCaseExcelService {
  private getSharedColumns() {
    return [
      { header: "caseNumber", key: "caseNumber", width: 20 },
      { header: "ascCenter", key: "ascCenter", width: 30 },
      { header: "customer", key: "customer", width: 30 },
      { header: "serialNumber", key: "serialNumber", width: 20 },
      { header: "status", key: "status", width: 15 },
      { header: "warrantyForm", key: "warrantyForm", width: 15 },
      { header: "receivedDate", key: "receivedDate", width: 15 },
      {
        header: "promisedDeliveryDate",
        key: "promisedDeliveryDate",
        width: 15,
      },
      { header: "totalCost", key: "totalCost", width: 15 },
      { header: "technicianName", key: "technicianName", width: 20 },
    ];
  }

  private fillSharedRows(sheet: ExcelJS.Worksheet, rows: RepairCaseDetail[]) {
    for (const row of rows) {
      sheet.addRow({
        caseNumber: row.caseNumber,
        ascCenter: row.ascCenter?.centerName || "",
        customer: row.customer?.fullName || "",
        serialNumber: row.serialNumber || "",
        status: row.status,
        warrantyForm: row.warrantyForm || "",
        receivedDate: row.receivedDate
          ? row.receivedDate.toISOString().split("T")[0]
          : "",
        promisedDeliveryDate: row.promisedDeliveryDate
          ? row.promisedDeliveryDate.toISOString().split("T")[0]
          : "",
        totalCost: row.totalCost ? Number(row.totalCost) : 0,
        technicianName: row.technicianName || "",
      });
    }
  }

  buildFixingWorkbook(rows: RepairCaseDetail[]) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Fixing");
    sheet.columns = this.getSharedColumns();
    this.fillSharedRows(sheet, rows);
    return workbook;
  }

  buildWaitingPartsWorkbook(rows: RepairCaseDetail[]) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Waiting Parts");
    sheet.columns = this.getSharedColumns();
    this.fillSharedRows(sheet, rows);
    return workbook;
  }

  buildExchangeInProgressWorkbook(rows: RepairCaseDetail[]) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Exchange In Progress");
    sheet.columns = this.getSharedColumns();
    this.fillSharedRows(sheet, rows);
    return workbook;
  }

  buildRepeatedHuyphieuWorkbook(rows: RepairCaseDetail[]) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Repeated Huyphieu");
    sheet.columns = this.getSharedColumns();

    // Sort by serialNumber
    const sortedRows = [...rows].sort((a, b) => {
      const s1 = a.serialNumber || "";
      const s2 = b.serialNumber || "";
      return s1.localeCompare(s2);
    });

    this.fillSharedRows(sheet, sortedRows);
    return workbook;
  }
}
