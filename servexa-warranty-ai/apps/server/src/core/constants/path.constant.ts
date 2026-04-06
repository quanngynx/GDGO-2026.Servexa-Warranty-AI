import path from "path";

// Ensure upload directories exist
export const uploadDirs = [
  "uploads",
  "uploads/avatars",
  "uploads/repair-cases",
  "uploads/repair-cases/model_serial",
  "uploads/repair-cases/repair_form",
  "uploads/repair-cases/before_repair",
  "uploads/repair-cases/after_repair",
  "uploads/repair-cases/parts_components",
  "uploads/repair-cases/warranty_invoice",
  "uploads/repair-cases/tmp",
];

export const dirs = [
  "thumbnail_product",
  "model_product",
  "repair_form",
  "shipping_fee_invoice",
  "order_invoice",
  "tmp",
];

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export const UPLOAD_TMP_DIR = path.join(UPLOAD_DIR, "tmp");
