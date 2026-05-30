# Servexa Server File Upload Patterns

Use this reference when changing upload behavior in `apps/server`.

## Existing Shared Upload Middleware

The shared middleware lives at `apps/server/src/core/file-storage/multer.ts` and exports `multerUpload`.

Current behavior:

- Uses `multer.diskStorage`.
- Creates upload directories under `uploads/`.
- Accepts a broad MIME allowlist from `apps/server/src/core/constants/file.constant.ts`.
- Applies `limits.fileSize` of `500 * 1024 * 1024`.
- Applies `limits.files` of `10`.
- Generates filenames with `userId`, request-controlled location data, timestamp, and random number.

Existing safe traits:

- Has a `fileFilter`.
- Has size and count limits.
- Creates directories with `recursive: true`.
- Does not directly store the raw original filename as the whole stored filename.

Existing hardening opportunities:

- Replace timestamp plus `Math.random()` with `crypto.randomUUID()`.
- Avoid using request-controlled folder values directly for storage layout.
- Normalize and constrain storage paths with `path.resolve` and an upload root boundary check.
- Add magic-byte validation and cleanup for rejected files.
- Split broad MIME allowlists into route-specific allowlists.
- Update the rejection message in `file.constant.ts`; it currently mentions only JPEG, PNG, WebP, and PDF while the allowlist also includes AVIF, MP4, XLSX, and XLS.

## Current MIME Allowlist

`apps/server/src/core/constants/file.constant.ts` currently allows:

```typescript
export const allowedMimes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
  "video/mp4",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];
```

Do not blindly reuse this list for every route. Create narrower route-specific lists:

- Repair-case images: image MIME types only.
- Excel imports: `.xlsx` and the XLSX MIME type only, unless legacy `.xls` is explicitly required.
- Document uploads: PDF and business-approved document/image types only.
- Video uploads: MP4 only where product requirements need it.

## Known Upload Gaps

### Repair-Case Images

File: `apps/server/src/modules/v1/asc-center/router/repair-case.route.ts`

Current pattern:

```typescript
const uploadDir = 'uploads/repair-cases'
const multerUpload = multer({ dest: uploadDir })

router.post('/:id/images', multerUpload.array('files', 10), controller.addImages)
```

Risk:

- No MIME allowlist.
- No extension allowlist.
- No `fileSize` limit.
- No magic-byte validation.
- Uses multer's generated destination filename without a domain-specific validation step.

Preferred direction:

- Replace with a route-specific image upload middleware.
- Keep `authenticateMiddleware` before multer; this route currently has `router.use(authenticateMiddleware)`.
- Add authorization for modifying the repair case before upload if available.
- Use `.array("files", 10)` plus a route-specific `fileSize` limit.
- Validate signatures after disk write and delete rejected files.

### Product Catalog Excel Imports

Files:

- `apps/server/src/modules/v1/product-catalog/router/model.route.ts`
- `apps/server/src/modules/v1/product-catalog/router/solution.route.ts`
- `apps/server/src/modules/v1/product-catalog/router/error-phenomenon.route.ts`

Current pattern:

```typescript
const upload = multer({ storage: multer.memoryStorage() })

modelRoute.post('/import', upload.single('file'), modelController.importExcel)
```

Risk:

- No `fileSize` limit while using memory storage.
- No MIME allowlist.
- No extension allowlist.
- No magic-byte validation before Excel parsing.

Preferred direction:

- Create a shared `excelUpload` middleware for product-catalog imports.
- Limit to one file and a small maximum size, for example 5 MB or a product-approved threshold.
- Accept `.xlsx` by default. Add `.xls` only if the service actually supports and tests legacy Excel.
- Validate `file.buffer` with `file-type` before invoking Excel parsing.
- Reject uploads with missing file, wrong field name, or multiple files.

## Middleware Ordering

Keep this order for upload routes:

1. Authentication.
2. Authorization for the target resource or import capability.
3. Multer middleware with route-specific allowlist and limits.
4. Signature/content validation middleware.
5. Controller.

Example:

```typescript
router.post(
  "/:id/images",
  authenticateMiddleware,
  canModifyRepairCase,
  repairCaseImageUpload.array("files", 10),
  validateUploadedFiles(repairCaseImagePolicy),
  controller.addImages,
);
```

Avoid writing files before access checks. Multer starts consuming the request body as soon as its middleware runs.

## Recommended Shared Helpers

For future implementation work, prefer small shared factories rather than one global upload config:

- `createDiskUpload(policy)` for persistent files.
- `createMemoryUpload(policy)` for small imports.
- `validateUploadedFiles(policy)` for magic-byte checks and disk cleanup.
- `sanitizeDisplayFilename(originalname)` for optional display metadata.
- `resolveUploadDirectory(base, routeSegment)` for path boundary checks.

Define policy objects close to the route module or in a feature upload config:

```typescript
const repairCaseImagePolicy = {
  fieldName: "files",
  maxFiles: 10,
  maxFileSizeBytes: 10 * 1024 * 1024,
  extensions: new Set([".jpg", ".jpeg", ".png", ".webp"]),
  mimes: new Set(["image/jpeg", "image/png", "image/webp"]),
};
```

## Test Cases To Add

For each upload route, verify:

- Valid upload succeeds.
- Missing auth fails before upload handling.
- Wrong extension fails.
- Spoofed `Content-Type` fails after signature validation.
- Oversized file fails.
- Too many files fail.
- Wrong form field fails.
- Rejected disk files are deleted.
- Download endpoints check authorization before returning content.

## Dependency Note

The example uses the `file-type` package for magic-byte validation. It appears in the lockfile transitively, but production upload code should add it as a direct dependency of `apps/server` before importing it:

```bash
pnpm --filter server add file-type
```
