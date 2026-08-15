# Servexa Warranty AI OpenWiki

Servexa Warranty AI is a monorepo for a warranty and after-sales operations platform with three main runtime surfaces:

- a **React 19 + Vite** internal web app for dashboards, repair-case operations, system administration, and AI copilot flows (`/apps/web`)
- an **Express 5 + Prisma + PostgreSQL/pgvector** backend that owns business APIs, identity, RAG storage, and upload/document handling (`/apps/server`)
- a **Python FastAPI + gRPC + LangGraph** AI service that handles coordinator/agent workflows and retrieval logic (`/apps/ai-services`)

There is also a **Fumadocs/Next.js docs app** in `/apps/fumadocs`, but its current content looks partly template/generated and should be treated as a separate documentation product rather than the canonical explanation of the repository.

## What this repository is for

At a product level, the repository combines classic warranty-service back office workflows with AI-assisted support:

- warranty lookup and repair-case management
- ASC center, inventory, and purchase-channel administration
- customer, user, role, and permission management
- document and knowledge ingestion for AI retrieval
- an operations copilot with reasoning traces and human-in-the-loop approvals

The project README frames this as an **AI-powered warranty intelligence platform** built around RAG, agentic orchestration, and internal support workflows (`/README.md`).

## Start here

- [Architecture overview](./architecture/overview.md)
- [Operations and data domains](./domain/operations-and-data.md)
- [AI and copilot systems](./ai/ai-and-copilot.md)
- [Development and deployment](./operations/dev-and-deploy.md)

## Repository map

### Applications

- `/apps/web` — authenticated operator UI, admin screens, dashboard widgets, auth routes, AI copilot screens
- `/apps/server` — REST API, auth, RBAC, domain services, Prisma schema, seed scripts, upload/document endpoints, AI orchestration bridge
- `/apps/ai-services` — FastAPI app, gRPC `AiService`, LangGraph coordinator, Redis consumers/workers, Python-side RAG logic
- `/apps/fumadocs` — Next.js/Fumadocs site for separately published docs/reference content

### Shared packages

- `/packages/ui` — shared React UI components, contexts, and global styling
- `/packages/env` — environment typing/runtime configuration (used across apps)
- `/packages/ai-contracts`, `/packages/event-contracts`, `/packages/proto` — cross-service contracts
- `/packages/db` — database-related package scaffolding and DB helper scripts; currently lighter-weight than the server’s in-app Prisma implementation
- `/packages/config`, `/packages/infra` — shared config/infrastructure support

## How the main runtime hangs together

1. The **web app** boots TanStack Router + TanStack Query and wraps the app with shared theme/font/direction providers (`/apps/web/src/main.tsx`).
2. The **server** bootstraps Express, Prisma, Redis, telemetry, static uploads, API routers, and a CopilotKit endpoint (`/apps/server/src/core/infra/bootstrap.ts`).
3. The **server** exposes versioned business APIs under `/v1/...` for identity, HR, product catalog, purchase channels, ASC center operations, AI, and documents (`/apps/server/src/modules/route-version-api.ts`).
4. The **AI service** runs FastAPI plus a gRPC server in the same process and mounts routers for agents, chat, RAG, observability, ERP/security, and health (`/apps/ai-services/src/main.py`).
5. AI-facing features cross the Node/Python boundary through gRPC, Redis job streams, and shared contracts.

## Major technical and business domains

### Warranty operations
Core entities include repair cases, warranty policies, ASC centers, technicians, payments, quotations, accessory requests, stock transactions, and related histories. The Prisma schema is the best source of truth for these relationships (`/apps/server/prisma/schema/schema.prisma`).

### Identity and authorization
The backend contains a full identity module with login, refresh/logout flows, hierarchical roles, permission resolution, and route-level authorization (`/apps/server/src/modules/v1/identity`).

### AI knowledge + copilot
The backend stores ingested knowledge chunks in PostgreSQL with `pgvector`; the AI service coordinates workflows and approvals; the web app exposes a full-page copilot and side-panel review UI.

### Administration
The sidebar structure in the web app is a useful high-level domain index because it mirrors the intended operator information architecture (`/apps/web/src/components/layout/data/sidebar-data.ts`).

## Local development in one screen

From repo root (`/package.json`):

- `pnpm dev` — run monorepo dev tasks through Turbo
- `pnpm dev:web` — web app only
- `pnpm dev:server` — server only
- `pnpm dev:docker-compose` — local Postgres + Redis
- `pnpm db:start` / `pnpm db:seed` / `pnpm db:migrate` — DB lifecycle helpers

Important local infra:

- PostgreSQL with `pgvector`
- Redis
- server env and AI service env/secrets

See [Development and deployment](./operations/dev-and-deploy.md) for details and caveats.

## What changed recently

Recent commit history shows the current emphasis:

- `c41ee8d` added/expanded **system administration modules, AI copilot features, and dashboard UI components**
- `9980304` improved **Docker + Nginx production setup** for the web app
- `bf50a9b` overhauled the **README architecture and AI workflow docs**
- `52321cc` continued UI integration/localization work in the web layer

That history is useful context: this repository is actively evolving, especially in the admin UI and AI-assisted operator experience.

## Important caveats for future agents

- Treat the **server Prisma schema** and route modules as the source of truth over README prose.
- The **Fumadocs app** exists, but its content currently appears mixed with template/demo material; do not assume it fully documents the live product.
- The repo contains local `.env` files and other secret-bearing files. Do not read them for documentation.
- `packages/db/src/index.ts` is currently commented out, so avoid claiming that package is the active runtime DB client.
- There are uncommitted local changes in docs/workflows and some new files in `.github` and `apps/web`; generated docs should avoid assuming those changes are already stabilized.

## Source anchors

- `/README.md`
- `/package.json`
- `/pnpm-workspace.yaml`
- `/turbo.json`
- `/apps/web/src/main.tsx`
- `/apps/server/src/index.ts`
- `/apps/server/src/core/infra/bootstrap.ts`
- `/apps/server/src/modules/route-version-api.ts`
- `/apps/ai-services/src/main.py`
- `/docker-compose.yml`
