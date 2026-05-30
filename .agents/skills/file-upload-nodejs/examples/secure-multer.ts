import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";

import type { RequestHandler } from "express";
import { fileTypeFromBuffer, fileTypeFromFile } from "file-type";
import multer from "multer";

export interface UploadPolicy {
  allowedExtensions: ReadonlySet<string>;
  allowedMimeTypes: ReadonlySet<string>;
  allowedSignatureMimeTypes?: ReadonlySet<string>;
  directory?: string;
  fieldName: string;
  maxFields?: number;
  maxFileSizeBytes: number;
  maxFiles: number;
}

const uploadRoot = path.resolve(process.cwd(), "uploads");

export const repairCaseImagePolicy: UploadPolicy = {
  allowedExtensions: new Set([".jpg", ".jpeg", ".png", ".webp"]),
  allowedMimeTypes: new Set(["image/jpeg", "image/png", "image/webp"]),
  directory: "repair-cases",
  fieldName: "files",
  maxFileSizeBytes: 10 * 1024 * 1024,
  maxFiles: 10,
};

export const excelImportPolicy: UploadPolicy = {
  allowedExtensions: new Set([".xlsx"]),
  allowedMimeTypes: new Set([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]),
  allowedSignatureMimeTypes: new Set([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]),
  fieldName: "file",
  maxFileSizeBytes: 5 * 1024 * 1024,
  maxFiles: 1,
};

export function createSecureDiskUpload(policy: UploadPolicy) {
  const destination = resolveUploadDirectory(policy.directory ?? "general");
  fs.mkdirSync(destination, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      try {
        cb(null, `${randomUUID()}${getAllowedExtension(file, policy)}`);
      } catch (error) {
        cb(error as Error, "");
      }
    },
  });

  return multer({
    storage,
    fileFilter: createFileFilter(policy),
    limits: createLimits(policy),
  });
}

export function createSecureMemoryUpload(policy: UploadPolicy) {
  return multer({
    storage: multer.memoryStorage(),
    fileFilter: createFileFilter(policy),
    limits: createLimits(policy),
  });
}

export function validateUploadedFileSignatures(policy: UploadPolicy): RequestHandler {
  return async (req, _res, next) => {
    const files = collectUploadedFiles(req);
    const allowedSignatures =
      policy.allowedSignatureMimeTypes ?? policy.allowedMimeTypes;

    try {
      for (const file of files) {
        const detected =
          file.buffer && file.buffer.length > 0
            ? await fileTypeFromBuffer(file.buffer)
            : file.path
              ? await fileTypeFromFile(file.path)
              : undefined;

        if (!detected || !allowedSignatures.has(detected.mime)) {
          throw new Error("Uploaded file content does not match an allowed type");
        }
      }

      next();
    } catch (error) {
      await cleanupDiskFiles(files);
      next(error);
    }
  };
}

function createFileFilter(policy: UploadPolicy): multer.Options["fileFilter"] {
  return (_req, file, cb) => {
    try {
      getAllowedExtension(file, policy);

      if (!policy.allowedMimeTypes.has(file.mimetype)) {
        cb(new Error("Unsupported upload MIME type"));
        return;
      }

      cb(null, true);
    } catch (error) {
      cb(error as Error);
    }
  };
}

function createLimits(policy: UploadPolicy): multer.Options["limits"] {
  return {
    fileSize: policy.maxFileSizeBytes,
    files: policy.maxFiles,
    fields: policy.maxFields ?? 10,
  };
}

function getAllowedExtension(file: Express.Multer.File, policy: UploadPolicy) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!policy.allowedExtensions.has(ext)) {
    throw new Error("Unsupported upload file extension");
  }

  return ext;
}

function resolveUploadDirectory(directory: string) {
  const resolved = path.resolve(uploadRoot, directory);

  if (resolved !== uploadRoot && !resolved.startsWith(`${uploadRoot}${path.sep}`)) {
    throw new Error("Upload directory escapes the upload root");
  }

  return resolved;
}

function collectUploadedFiles(req: Parameters<RequestHandler>[0]) {
  if (Array.isArray(req.files)) {
    return req.files;
  }

  if (req.files && typeof req.files === "object") {
    return Object.values(req.files).flat();
  }

  return req.file ? [req.file] : [];
}

async function cleanupDiskFiles(files: Express.Multer.File[]) {
  await Promise.all(
    files.map((file) => (file.path ? rm(file.path, { force: true }) : undefined)),
  );
}

/*
Example route wiring:

router.post(
  "/:id/images",
  authenticateMiddleware,
  canModifyRepairCase,
  createSecureDiskUpload(repairCaseImagePolicy).array(
    repairCaseImagePolicy.fieldName,
    repairCaseImagePolicy.maxFiles,
  ),
  validateUploadedFileSignatures(repairCaseImagePolicy),
  controller.addImages,
);

router.post(
  "/import",
  authenticateMiddleware,
  createSecureMemoryUpload(excelImportPolicy).single(excelImportPolicy.fieldName),
  validateUploadedFileSignatures(excelImportPolicy),
  controller.importExcel,
);
*/
