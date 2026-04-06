import multer from "multer";
import fs from "fs";
import type { Request } from "express";

import { uploadDirs } from "@/core/constants/path.constant";
import { allowedMimes } from "../constants/file.constant";
import path from "path";

export type ImageTypeDir =
  | "/products/thumbnail_product"
  | "/products/model_product"
  | "/products/repair_form"
  | "/products/shipping_fee_invoice"
  | "/products/order_invoice"
  | "/products/tmp";

export interface SourceImageType {
  locationFile: ImageTypeDir;
}

// Ensure temp directory exists
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only support kind of (JPEG, PNG, WebP) và PDF"));
  }
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const sourceImageType = (req.body as Partial<SourceImageType>) || {};
    const qFolder =
      typeof req.query.folder === "string" ? req.query.folder : undefined;
    const locationRaw =
      (typeof sourceImageType.locationFile === "string" &&
        sourceImageType.locationFile) ||
      qFolder ||
      "general";
    const location = locationRaw.replace(/^\/+/, "");
    const uploadPath = path.join("uploads", location);
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
    } catch {
      console.error(`Failed to create directory ${uploadPath}`);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const userId = req.user.userId || "anonymous";
    const sourceImageType = (req.body as Partial<SourceImageType>) || {};
    const qFolder =
      typeof req.query.folder === "string" ? req.query.folder : undefined;
    const locationRaw =
      (typeof sourceImageType.locationFile === "string" &&
        sourceImageType.locationFile) ||
      qFolder ||
      "general";
    const location = locationRaw.replace(/^\/+/, "");
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const unique = timestamp + "-" + Math.round(Math.random() * 1e9);
    const safeLocation = location.replace(/[^a-zA-Z0-9_\-\\/]/g, "");
    const filename = `${userId}-${safeLocation}-${unique}${extension}`;
    cb(null, filename);
  },
});

export const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // up to 500MB
    files: 10,
  },
});
