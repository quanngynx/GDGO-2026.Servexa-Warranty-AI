import type { RepairCaseStatus } from "@/libs/api/asc-center/repair-case/data-transfer-object";

export const repairCaseStatusLabels: Record<RepairCaseStatus, string> = {
  tiepnhan: 'Received',
  dangsua: 'Repairing',
  chocaplk: 'Waiting Parts',
  choykienkhach: 'Waiting Customer',
  choykiencongty: 'Waiting Company',
  khachkhongsua: 'Customer Declined',
  khongsuaduoc: 'Unrepairable',
  exchange_completed_asc: 'Exchange Completed',
  cs_supported_asc: 'CS Supported',
  suaxong: 'Repaired',
  dagiao: 'Delivered',
  hoanthanh: 'Completed',
  huyphieu: 'Cancelled',
}
