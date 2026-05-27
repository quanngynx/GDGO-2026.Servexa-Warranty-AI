---
name: File Upload NodeJS Skill
overview: Create a new `file-upload-nodejs` skill in `.agents/skills/`, `.claude/skills/`, and `.cursor/skills/` that guides implementing and auditing OWASP-compliant file uploads in the Express/multer server at `apps/server`.
todos:
  - id: create-dirs
    content: "Create skill directories in all three trees: .agents/skills/file-upload-nodejs/{references,examples}, .claude/skills/file-upload-nodejs/{references,examples}, .cursor/skills/file-upload-nodejs/{references,examples}"
    status: completed
  - id: write-skill-md
    content: "Write SKILL.md with frontmatter (name, description, trigger phrases) and lean body (~1,500 words): OWASP checklist table, workflow steps, pointers to references and examples"
    status: completed
  - id: write-owasp-controls
    content: "Write references/owasp-controls.md: all 8 OWASP File Upload controls adapted for multer/Node.js with code snippets"
    status: completed
  - id: write-codebase-patterns
    content: "Write references/codebase-patterns.md: document existing shared multer config, MIME allowlist, known security gaps (repair-case and Excel import routes)"
    status: completed
  - id: write-example
    content: "Write examples/secure-multer.ts: complete hardened multer factory with MIME allowlist filter, UUID filename, size/count limits"
    status: completed
  - id: copy-to-all-trees
    content: Mirror identical files under .claude/skills/file-upload-nodejs/ and .cursor/skills/file-upload-nodejs/
    status: pending
isProject: false
---

# File Upload NodeJS Skill

## Skill location (matching project convention — skills live in all three trees)

- [`apps/server/src/core/file-storage/multer.ts`](apps/server/src/core/file-storage/multer.ts) — existing shared multer config (reference point for examples)
- [`apps/server/src/core/constants/file.constant.ts`](apps/server/src/core/constants/file.constant.ts) — existing MIME allowlist
- New skill written once, mirrored to all three locations:
  - `.agents/skills/file-upload-nodejs/`
  - `.claude/skills/file-upload-nodejs/`
  - `.cursor/skills/file-upload-nodejs/`

## Directory structure

```
file-upload-nodejs/
├── SKILL.md                       ~1,500 words, core guidance
├── references/
│   ├── owasp-controls.md          All OWASP controls adapted for multer/Node.js
│   └── codebase-patterns.md       Existing server patterns + known security gaps
└── examples/
    └── secure-multer.ts           Complete hardened multer factory example
```

## SKILL.md frontmatter

Trigger phrases cover both implementation and review use-cases:

```yaml
---
name: File Upload in NodeJS
description: >
  This skill should be used when the user asks to "implement file upload",
  "secure file upload", "configure multer", "audit file upload security",
  "add OWASP file upload controls", "fix file upload vulnerability",
  "file type validation", "upload middleware", or "review upload routes".
  Provides OWASP-aligned guidance for Express/multer file uploads in apps/server.
version: 0.1.0
---
```

## SKILL.md body (core content)

- Purpose: implement and audit file uploads in the Node.js/Express server following [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- Quick-reference OWASP checklist (8 controls as a table)
- Pointer to `references/owasp-controls.md` for per-control details
- Pointer to `references/codebase-patterns.md` for server-specific patterns and known gaps
- Pointer to `examples/secure-multer.ts` for a drop-in hardened config

## references/owasp-controls.md

All OWASP File Upload controls adapted to this stack:

| Control | Node.js/multer implementation |
|---|---|
| Extension allowlist | `fileFilter` against a `Set<string>` of extensions |
| Content-Type validation | Check `req.headers['content-type']`, never trust alone |
| File signature (magic bytes) | Read first 4–8 bytes with `file-type` npm package |
| Filename safety | Replace original name with `crypto.randomUUID() + ext` |
| Size limit | `limits.fileSize` in multer options |
| File count limit | `limits.files` in multer options |
| Storage location | Outside web root (`uploads/` not under `public/`) |
| Auth before upload | Route-level `authenticateJWT` middleware before multer |

## references/codebase-patterns.md

Documents the **existing** server setup and **known gaps** found during exploration:

**Working correctly (shared `multerUpload`):**
- `POST /v1/document/documents` — MIME filter + 500 MB limit + 10 file limit

**Known gaps to fix:**
- `asc-center/router/repair-case.route.ts` — uses `multer({ dest: 'uploads/repair-cases' })` with **no MIME/size filter**
- `product-catalog/router/model.route.ts`, `solution.route.ts`, `error-phenomenon.route.ts` — `memoryStorage()` with **no MIME or size validation** for Excel imports
- Reject message in `file.constant.ts` does not mention all accepted types (avif, mp4, xlsx)

**How to reuse the shared config** for any new route.

## examples/secure-multer.ts

Complete hardened factory example:

```typescript
// Shows: allowlist filter, file-type magic-byte check, UUID rename,
// size + count limits, diskStorage to uploads/
```

## Files to create (12 total — 4 files × 3 trees)

```
.agents/skills/file-upload-nodejs/SKILL.md
.agents/skills/file-upload-nodejs/references/owasp-controls.md
.agents/skills/file-upload-nodejs/references/codebase-patterns.md
.agents/skills/file-upload-nodejs/examples/secure-multer.ts

.claude/skills/file-upload-nodejs/   (identical copy)
.cursor/skills/file-upload-nodejs/   (identical copy)
```

All three trees get identical content, matching the convention used by every other skill in this repo (e.g. `shadcn`, `turborepo`, `vercel-react-best-practices` all exist in `.agents/`, `.claude/`, and `.cursor/`).
