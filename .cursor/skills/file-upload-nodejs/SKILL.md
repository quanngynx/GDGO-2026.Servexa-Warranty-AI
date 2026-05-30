---
name: File Upload in NodeJS
description: This skill should be used when the user asks to "implement file upload", "secure file upload", "configure multer", "audit file upload security", "add OWASP file upload controls", "fix file upload vulnerability", "file type validation", "upload middleware", or "review upload routes". Provides OWASP-aligned guidance for Express/multer file uploads in apps/server.
version: 0.1.0
---

# File Upload in NodeJS

Implement and review file uploads in `apps/server` using the OWASP File Upload Cheat Sheet and the server's existing Express/multer patterns. Treat every uploaded file as hostile until validation, storage, authorization, and follow-up processing prove otherwise.

## When To Use

Use this skill for any task that creates, changes, or reviews file upload behavior in the Node.js API, especially:

- Adding an Express route that accepts `multipart/form-data`.
- Configuring `multer`, `memoryStorage`, or `diskStorage`.
- Importing Excel files, PDFs, images, videos, or documents.
- Fixing upload route vulnerabilities or missing limits.
- Reviewing storage paths, filenames, MIME allowlists, or download handlers.
- Hardening existing upload routes against OWASP unrestricted file upload risks.

## Required Workflow

1. Inspect the route before editing. Confirm authentication and authorization middleware run before multer consumes the body.
2. Identify accepted business file types. Prefer a narrow allowlist per route instead of a global broad allowlist.
3. Validate in layers: extension, reported MIME type, and file signature. Do not rely on any single check.
4. Replace client filenames with server-generated names. Use UUIDs or opaque database IDs, preserving only an allowlisted extension.
5. Store files outside any public static directory. Serve files through an authorization-checking controller rather than exposing raw paths.
6. Apply `limits.fileSize`, `limits.files`, and route-level rate limiting. Choose smaller limits for imports than for media uploads.
7. Process files defensively. Re-encode images with `sharp`, parse Office files with hardened libraries, and avoid ZIP uploads unless decompression limits are implemented.
8. Record enough metadata for audit and deletion: uploader, storage key, validated type, size, route/use-case, and creation time.
9. Add tests or manual verification for valid files, invalid extension, spoofed MIME, oversized body, too many files, and unauthenticated upload.

## OWASP Control Checklist

| Control | Node.js and multer action |
|---|---|
| Extension allowlist | Parse with `path.extname`, lowercase it, and compare against a route-specific `Set`. |
| Content-Type validation | Check `file.mimetype` as a fast allowlist gate, but treat it as spoofable. |
| File signature validation | Use magic-byte detection such as `file-type` after upload or while buffering. |
| Filename safety | Generate `crypto.randomUUID()` filenames; never trust `file.originalname` for storage. |
| File content validation | Re-encode images, parse documents safely, and reject active or unexpected content. |
| Storage location | Store outside web root; serve through app handlers with authorization checks. |
| User permissions | Run authentication and authorization before upload middleware. |
| Upload limits | Set `fileSize`, `files`, expected field names, and relevant request/rate limits. |

## Codebase-Specific Guidance

Prefer extending the shared upload pattern in `apps/server/src/core/file-storage/multer.ts` when a route should share the same storage conventions. The current shared config already has a MIME allowlist and count/size limits, but it still accepts a broad set of file types and builds storage paths from request data. For sensitive routes, create a narrower upload factory or route-specific wrapper.

Pay special attention to known ad hoc multer usage:

- `apps/server/src/modules/v1/asc-center/router/repair-case.route.ts` uses `multer({ dest: "uploads/repair-cases" })` for repair-case images. Add MIME, extension, signature, size, and filename controls before using this pattern elsewhere.
- `apps/server/src/modules/v1/product-catalog/router/model.route.ts`, `solution.route.ts`, and `error-phenomenon.route.ts` use `memoryStorage()` for Excel imports without explicit MIME or size limits. Add a dedicated Excel upload middleware with small limits and `.xlsx` validation.
- `apps/server/src/core/constants/file.constant.ts` defines a broad `allowedMimes` list. Avoid reusing the whole list for specialized routes.

## Implementation Rules

### Authentication First

Place `authenticateMiddleware` and any authorization middleware before multer:

```typescript
router.post(
  "/import",
  authenticateMiddleware,
  authorizeImport,
  excelUpload.single("file"),
  controller.importExcel,
);
```

Avoid route-level arrangements where multer writes a file before access control runs.

### Narrow Allowlists

Create route-specific allowlists. For example, Excel import routes should not share image or PDF MIME types:

```typescript
const excelExtensions = new Set([".xlsx"]);
const excelMimes = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);
```

Use global allowlists only as a fallback for shared document endpoints.

### Filename And Path Safety

Generate names with `randomUUID()`. Keep user-provided names only as display metadata after sanitization. Normalize and constrain storage directories, and reject route input that tries to influence parent paths.

### Memory Storage Caution

Use `memoryStorage()` only for small imports that are immediately parsed. Always set strict `fileSize` and `files` limits. For media and large documents, prefer disk or object storage plus post-upload validation.

### Signature Validation

Multer `fileFilter` can check extension and reported MIME before storage. Magic-byte validation usually needs the saved file path or buffer. Add cleanup logic that deletes rejected files after signature validation fails.

## Additional Resources

Read these files when implementing or auditing:

- `references/owasp-controls.md` - Detailed OWASP controls mapped to Express, multer, and Node.js.
- `references/codebase-patterns.md` - Current server upload patterns, safe reuse points, and known gaps.
- `examples/secure-multer.ts` - A hardened upload factory example with UUID filenames, route-specific allowlists, limits, and signature validation cleanup.

## Validation Checklist

Before finishing upload work, verify:

- Authentication and authorization run before multer.
- Accepted extensions and MIME types are route-specific.
- Magic-byte validation exists for persistent files.
- Oversized files and too many files fail before processing.
- Stored filenames are generated by the server.
- Upload directories are outside public static serving.
- Rejected files are removed from disk.
- Controller code does not trust `originalname`, `mimetype`, or client path data.
