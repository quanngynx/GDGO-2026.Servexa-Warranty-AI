# Security Policy

Servexa Warranty AI is a monorepo for warranty and ASC (authorized service center) operations. It includes a React web app, an Express API, a Python AI worker, PostgreSQL, and Redis. This document describes how to report security issues and what the project expects from reporters and maintainers.

## Scope

In-scope components:

| Component | Path | Notes |
|-----------|------|--------|
| Web client | `apps/web` | React SPA, talks to the API with JWT |
| API server | `apps/server` | Express 5, identity/RBAC, uploads, AI/HITL, CopilotKit |
| AI worker | `apps/ai-services` | FastAPI, LangGraph, Redis jobs, gRPC to Node |
| Shared packages | `packages/env`, `packages/proto`, `packages/event-contracts`, etc. | When used by the apps above |
| Deployment configs | `docker-compose*.yml`, `apps/server/Dockerfile`, CI workflows | Misconfigurations with security impact |

Out of scope unless they enable exploitation of the above:

- Third-party dependency CVEs without a demonstrated exploit path in this repo
- Issues in vendored skills, CopilotKit plugin docs, or example configs not used in production
- Social engineering, physical access, or denial-of-service without a clear, reproducible flaw in application code
- Findings that require compromised maintainer machines or stolen production secrets you do not control

## Supported versions

This repository is **private application software**, not a versioned library. Security fixes are applied on the **default branch** (`main` or the branch used for production deploys).

| Branch / deployment | Security updates |
|---------------------|------------------|
| Active default branch and tagged production releases | Supported |
| Old forks, local experiments, unmaintained branches | Not supported |

There is no separate LTS matrix (for example `5.1.x`). Use git tags or deploy dates when asking whether a fix has reached your environment.

## Reporting a vulnerability

**Do not** open a public GitHub issue for exploitable security bugs (authentication bypass, IDOR, RCE, SQL injection, secret leakage, etc.).

### Preferred channel

1. Open a **private** report via GitHub: **Security** → **Report a vulnerability** on this repository,  
   or use [GitHub private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) if enabled for the org.
2. If private reporting is unavailable, contact the **repository maintainers** directly (team channel or email used for production incidents). Do not post details in public issues, PRs, or chat logs.

### What to include

- Clear description of the impact (confidentiality, integrity, availability)
- Affected component (`apps/server`, `apps/web`, `apps/ai-services`, etc.)
- Steps to reproduce on a **local or staging** setup (minimal PoC)
- Request/response samples or screenshots with **secrets redacted**
- Your assessment of severity (optional)

### What to avoid sending

- Production database dumps, real user PII, or live JWT refresh tokens
- `.env` files, `AI_INTERNAL_INGEST_SECRET`, API keys, or private keys
- Automated scanner output without manual validation and a working exploit path

## Response expectations

| Stage | Target |
|-------|--------|
| Initial acknowledgment | Within **5 business days** |
| Triage (valid / duplicate / out of scope) | Within **10 business days** |
| Fix or mitigation plan for accepted issues | Depends on severity; critical issues prioritized |

We may ask for clarification. We will not pursue legal action against researchers who follow this policy and avoid privacy violations, data destruction, or service disruption beyond what is needed to demonstrate the issue.

## Security architecture (summary)

Understanding the system helps write accurate reports.

- **Authentication:** JWT access tokens with per-user key material, client id header, blacklist checks, and refresh-token handling (`apps/server`).
- **Authorization:** Hierarchical RBAC. Route handlers use `resolvePermissions` and `requirePermissions` with keys such as `users.read`, `repair_case.write`, and `catalog.write`. Permissions are loaded from the database (not trusted from the JWT payload alone). Run identity/API permission seeds after deploy when roles change.
- **AI / HITL:** Human-in-the-loop flows with policy checks on repair-case ASC access; async work uses Redis streams.
- **Internal ingest:** Worker → server knowledge ingest uses `x-internal-ingest-key` (`AI_INTERNAL_INGEST_SECRET`). Treat this like an API secret; protect network path in production.
- **File uploads:** Shared multer configuration enforces allowed MIME types, size limits, and upload paths under `uploads/` (path traversal rejected). Repair-case images use a dedicated, restricted uploader.
- **Production runtime:** Server ships as bundled `dist/index.mjs` (tsdown). Do not rely on Node experimental TypeScript flags in production.
- **Public routes:** `GET /health` is a lightweight liveness probe (no auth). `GET /` and `GET /health/deep` require `x-api-key` matching `PUBLIC_ROUTES_API_KEY` (rate-limited; no JWT). Deep health checks database and Redis.
- **Production Redis:** Startup fails if Redis is required and unavailable.

For deeper runtime rules (Node vs Python, RAG corpus, job ownership), see [`documents/ai-runtime-policy.md`](documents/ai-runtime-policy.md).

## Secure development practices

Contributors should:

- Never commit `.env`, credentials, or production connection strings. Use `packages/env` validation and local `.env` files listed in `.gitignore`.
- Run `pnpm --filter server test` and `pnpm --filter server check-types` before merging server changes.
- Apply Prisma migrations through reviewed migration files; avoid ad-hoc `db push` on shared production databases.
- Review RBAC when adding routes: `authenticatedWithPermissions` plus `requireRoutePermissions` for sensitive v1 APIs.
- Follow OWASP-oriented upload guidance in `.agents/skills/file-upload-nodejs` when changing upload routes.

## Disclosure

When a fix is released, maintainers may publish a short advisory (GitHub Security Advisory or internal release notes) with credit if the reporter agrees. Please allow a reasonable embargo so users can patch before public disclosure.

## Related documentation

- [`CLAUDE.md`](CLAUDE.md) — monorepo layout and commands
- [`documents/ai-runtime-policy.md`](documents/ai-runtime-policy.md) — AI runtime ownership and data boundaries
- [`.github/workflows/server-ci.yml`](.github/workflows/server-ci.yml) — server build, migrate, and smoke checks
