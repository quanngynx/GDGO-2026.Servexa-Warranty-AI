# OWASP File Upload Controls For Node.js

Use this reference when implementing or auditing Express/multer upload routes. The OWASP position is defense in depth: no single validation step is enough.

## 1. Extension Allowlist

Accept only business-required extensions. Normalize the filename before checking. Validate after decoding, lowercase the extension, and reject double-extension tricks by deriving the final extension with `path.extname`.

```typescript
import path from "node:path";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function hasAllowedExtension(originalname: string) {
  const ext = path.extname(originalname).toLowerCase();
  return imageExtensions.has(ext);
}
```

Do not use a blocklist as the primary control. Blocklists miss new dangerous extensions and are easy to bypass with `.jpg.php`, null bytes, or flawed regular expressions.

## 2. Content-Type Validation

Use `file.mimetype` as a quick early reject, not as proof. The client supplies this value and can spoof it.

```typescript
const imageMimes = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasAllowedMime(file: Express.Multer.File) {
  return imageMimes.has(file.mimetype);
}
```

Keep MIME allowlists route-specific. Excel imports should not accept image, PDF, or video types just because another endpoint does.

## 3. File Signature Validation

Validate magic bytes after upload for files that will be persisted, served, parsed, or processed. Install `file-type` as a direct server dependency before using this pattern.

```typescript
import { fileTypeFromFile } from "file-type";

const allowedDetectedMimes = new Set(["image/png", "image/jpeg", "application/pdf"]);

async function assertDetectedMime(filePath: string) {
  const detected = await fileTypeFromFile(filePath);

  if (!detected || !allowedDetectedMimes.has(detected.mime)) {
    throw new Error("Uploaded file content does not match an allowed type");
  }
}
```

For `memoryStorage()` imports, use `fileTypeFromBuffer(file.buffer)`. Signature validation is still one layer only; polyglot files and parser bugs can exist.

## 4. Filename Safety

Never store files under `file.originalname`. Generate a random server filename and persist the original name only as sanitized display metadata if business logic needs it.

```typescript
import { randomUUID } from "node:crypto";
import path from "node:path";

function buildStoredName(originalname: string) {
  const ext = path.extname(originalname).toLowerCase();
  return `${randomUUID()}${ext}`;
}
```

Reject or normalize leading dots, repeated dots, path separators, control characters, reserved Windows names, and excessive length when storing display names.

## 5. File Content Validation

Validate content according to the expected business type:

- Images: re-encode with `sharp` to strip active content and metadata.
- PDFs: avoid executing embedded scripts; prefer server-side scanning before public release.
- Office documents: parse with a hardened library and reject macros unless explicitly required.
- ZIP files: avoid accepting them. If required, enforce decompressed size, entry count, path traversal checks, and nested archive limits.

Example image re-encoding:

```typescript
import sharp from "sharp";

async function rewriteImage(inputPath: string, outputPath: string) {
  await sharp(inputPath)
    .rotate()
    .webp({ quality: 85 })
    .toFile(outputPath);
}
```

Run malware scanning or manual review for public or high-risk uploads when operationally possible. Avoid sending sensitive files to public scanning APIs unless data leakage has been reviewed.

## 6. File Storage Location

Prefer object storage or a separate host. If local filesystem storage is used, store outside any public web root and serve through controllers that check authorization.

```typescript
import path from "node:path";

const uploadRoot = path.resolve(process.cwd(), "uploads");
const routeDir = path.resolve(uploadRoot, "repair-cases");

if (!routeDir.startsWith(uploadRoot + path.sep)) {
  throw new Error("Invalid upload directory");
}
```

Do not expose `uploads/` as static middleware unless every file is intended to be public and safe to cache.

## 7. User Permissions

Authenticate and authorize before multer reads or writes file data.

```typescript
router.post(
  "/:id/images",
  authenticateMiddleware,
  canModifyRepairCase,
  repairCaseUpload.array("files", 10),
  controller.addImages,
);
```

Enforce permissions again on download routes. Avoid relying on unguessable filenames as the only access control.

## 8. Filesystem Permissions

Run the app as a non-root user and grant write access only to required upload directories. Uploaded files should not be executable. In containers, create upload directories explicitly and chown only those paths.

For Docker images, keep upload paths separate from application source code and avoid broad recursive ownership changes over the whole app when only upload/log directories need writes.

## 9. Upload And Download Limits

Set limits on size and count in multer. Add route-level and global rate limits for expensive upload or download endpoints.

```typescript
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 3,
    fields: 10,
  },
});
```

Use tighter limits for `memoryStorage()` because the full file resides in process memory. Excel imports often need single-file limits measured in a few megabytes, not hundreds of megabytes.

## 10. CSRF And Public Retrieval

Protect browser-originated upload flows from CSRF if cookie authentication is used. Require CSRF tokens, SameSite cookies, or equivalent framework controls.

For downloads, avoid direct filesystem paths. Map opaque IDs to stored files in the database, check access, set safe response headers, and rate-limit large responses.

## Review Red Flags

- `multer({ dest: "..." })` with no `fileFilter` or `limits`.
- `multer.memoryStorage()` with no strict `fileSize`.
- Reusing a global allowlist for unrelated business workflows.
- Writing files before authentication middleware.
- Using `originalname` in persisted paths.
- Serving `uploads/` statically.
- Parsing Office, PDF, image, or archive files without type-specific safeguards.
