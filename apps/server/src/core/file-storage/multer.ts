import multer from "multer";
import fs from "fs";
import type { Request } from "express";
import path from "path";

import { uploadDirs } from "@/core/constants/path.constant";
import { allowedMimes } from "../constants/file.constant";

export type ImageTypeDir =
  | "/accessories"
  | "/accessories/thumbnail"
  | "/avatars/"
  | "/products"
  | "/products/thumbnail"
  | "/products/model"
  | "/repair-cases"
  | "/repair-cases/after_repair"
  | "/repair-cases/before_repair"
  | "/repair-cases/model_serial"
  | "/repair-cases/repair_ticket"
  | "/repair-cases/warranty_invoice"

export interface SourceImageType {
  locationFile: ImageTypeDir;
}

const UPLOADS_ROOT = path.resolve("uploads");

/** FIX:1103 Reject path traversal and resolve paths under `uploads/`. */
export function resolveUploadSubpath(locationRaw: string): string {
  const trimmed = locationRaw.trim().replace(/^\/+/, "");
  const segments = trimmed.split(/[/\\]/).filter(Boolean);
  if (segments.length === 0 || segments.some((segment) => segment === "..")) {
    throw new Error("Invalid upload path");
  }
  const resolved = path.resolve(UPLOADS_ROOT, ...segments);
  const rootWithSep = UPLOADS_ROOT.endsWith(path.sep)
    ? UPLOADS_ROOT
    : UPLOADS_ROOT + path.sep;
  if (resolved !== UPLOADS_ROOT && !resolved.startsWith(rootWithSep)) {
    throw new Error("Invalid upload path");
  }
  return resolved;
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

function readLocationFromRequest(req: Request): string {
  const sourceImageType = (req.body as Partial<SourceImageType>) || {};
  const qFolder =
    typeof req.query.folder === "string" ? req.query.folder : undefined;
  return (
    (typeof sourceImageType.locationFile === "string" &&
      sourceImageType.locationFile) ||
    qFolder ||
    "general"
  );
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    try {
      const uploadPath = resolveUploadSubpath(readLocationFromRequest(req));
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(
        error instanceof Error ? error : new Error(String(error)),
        "",
      );
    }
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || "anonymous";
    const location = readLocationFromRequest(req).replace(/^\/+/, "");
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
    fileSize: 25 * 1024 * 1024,
    files: 10,
  },
});

const repairCaseStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      const uploadPath = resolveUploadSubpath("repair-cases");
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(
        error instanceof Error ? error : new Error(String(error)),
        "",
      );
    }
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || "anonymous";
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const unique = timestamp + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${userId}-repair-cases-${unique}${extension}`);
  },
});

/** Repair-case image uploads: MIME-filtered, size-capped, fixed subdirectory. */
export const repairCaseMulterUpload = multer({
  storage: repairCaseStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

export const multerMemoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const imageMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/gif",
      "image/avif",
    ];
    if (imageMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP) are allowed"));
    }
  },
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

