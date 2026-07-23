# Architecture overview

## Top-level shape

This is a **pnpm + Turbo monorepo** (`/package.json`, `/pnpm-workspace.yaml`, `/turbo.json`) organized around multiple deployable apps plus shared packages.

```text
apps/
  web         React/Vite operator UI
  server      Express/Prisma business API
  ai-services FastAPI + gRPC + LangGraph AI runtime
  fumadocs    Next.js documentation site
packages/
  ui          shared UI components and contexts
  env         runtime env helpers
  ai-contracts / event-contracts / proto   shared contracts
  db / infra / config                      shared support packages
```

## Runtime responsibilities

### 1) Web app (`/apps/web`)

The web app is the main operator-facing surface.

Key runtime facts:

- React 19 with Vite (`/apps/web/package.json`)
- TanStack Router for route structure (`/apps/web/src/main.tsx`)
- TanStack Query for API data fetching and mutation handling (`/apps/web/src/main.tsx`)
- shared providers from `@servexa-warranty-ai/ui/contexts` for theme, font, and layout direction
- i18n initialization via `/apps/web/src/i18n/config.ts`

The auth boundary is enforced client-side through file-based routing. The `_authenticated` route redirects unauthenticated users to sign-in (`/apps/web/src/routes/_authenticated/route.tsx`).

The app’s information architecture is visible in the sidebar definition (`/apps/web/src/components/layout/data/sidebar-data.ts`): dashboard, repair cases, operations intelligence, payment workflows, reports, admin modules, reference docs, and RBAC screens.

### 2) Server (`/apps/server`)

The Node server is the business-system center of gravity.

Boot process (`/apps/server/src/core/infra/bootstrap.ts`):

- enables proxy awareness
- installs Helmet, CORS, compression, JSON/urlencoded body parsing
- adds request context, user context, and request logging middleware
- initializes telemetry, Prisma, and Redis
- mounts health endpoints, static uploads, versioned API routes, CopilotKit router, and a bootstrap AI route
- creates upload directories if missing

The entrypoint is minimal (`/apps/server/src/index.ts`): create `AppBootStrap`, `bootstrap()`, then `listen(env.PORT)`.

### 3) AI services (`/apps/ai-services`)

The Python AI app runs both:

- a FastAPI HTTP server
- a gRPC `AiService` server in the same process

The lifecycle in `/apps/ai-services/src/main.py` configures observability, tries repeatedly to bind the gRPC port, mounts CORS + request logging middleware, and includes the aggregate API routers.

This service owns:

- LangGraph coordination
- agent/tool routing
- Python-side retrieval logic
- Redis workers/consumers for AI job streams
- gRPC bridge behavior consumed by the Node server

### 4) Fumadocs app (`/apps/fumadocs`)

This is a separate Next.js/Fumadocs application (`/apps/fumadocs/package.json`). Its `source.config.ts` shows a fairly advanced MDX pipeline with code highlighting, math, auto type tables, JSON schema, and last-modified plugins.

However, the current content tree contains obvious template/generated pages under `content/docs`, so it should be treated as a docs product under construction rather than the best source of truth for repository behavior.

## Server module boundaries

The server exposes versioned APIs via `/apps/server/src/modules/route-version-api.ts`:

- `/v1/identity`
- `/v1/human-resources`
- `/v1/product-catalog`
- `/v1/purchase-channels`
- `/v1/asc-center`
- `/v1/ai`
- `/v1/document`

That module split is the cleanest architecture map for backend ownership:

- **identity** — authentication, users, roles, permissions
- **human-resources** — customers, employees, technicians
- **product-catalog** — categories, models, accessories, solutions, warranty policies
- **purchase-channels** — purchase locations and location groups
- **asc-center** — repair cases, payments, stocktakes, accessory requests/vouchers
- **ai** — query/jobs, knowledge ingestion/search, workflows, tools, HITL, reasoning traces
- **document** — document records and file-related APIs

## AI architecture across Node and Python

The AI system is deliberately split across services.

### Node side
Node owns:

- persistent business data and knowledge-document storage in Prisma/Postgres
- authenticated APIs for knowledge ingestion/search and HITL management
- CopilotKit runtime exposure
- Redis-based job stream integration
- route-level governance and audit/event publishing

### Python side
Python owns:

- LangGraph coordinator construction (`/apps/ai-services/src/modules/v1/agents/services/coordinator_service.py`)
- route selection between operations and supply-chain flows
- interrupt/resume handling for human approvals
- trace emission for reasoning steps
- Python retrieval service wrappers (`/apps/ai-services/src/modules/v1/rag/services/rag_service.py`)

### Why the split exists

This split lets the repo keep:

- **business/system-of-record logic** in TypeScript alongside Prisma and Express
- **agent orchestration and graph runtime behavior** in Python, where LangGraph ecosystem usage is more direct

## Data and infrastructure flow

### Core persistence

- PostgreSQL is the primary relational store
- `pgvector` is enabled in Prisma datasource config (`/apps/server/prisma/schema/schema.prisma`)
- Redis is used for caching and AI job streams
- uploaded files are served from `/uploads`

### Local infra

`/docker-compose.yml` provisions:

- `postgres` using a `pgvector` image
- `redis` with authentication and basic hardening

### Shared contracts

Cross-service interoperability is reinforced by workspace packages:

- `@servexa-warranty-ai/ai-contracts`
- `@servexa-warranty-ai/event-contracts`
- `@servexa-warranty-ai/proto`

These reduce duplication between the web app, Node server, and Python service.

## Request flow examples

### Standard business page

1. User navigates in the web app.
2. TanStack Query calls server REST endpoints.
3. Express module controller → service → repository/Prisma.
4. JSON response returns to UI tables/forms.

### Copilot / AI flow

1. User opens Operations Intelligence or other AI UI.
2. Web app sends authenticated AI requests to Node endpoints/CopilotKit.
3. Node may query business data, RAG storage, or invoke gRPC/Redis-backed AI workflows.
4. Python coordinator routes work, may pause for HITL approval, and emits reasoning traces.
5. Node persists/serves resulting workflow state back to the UI.

## Architecture caveats

- The architecture is **feature-rich but still evolving**; recent commits heavily touched admin UI and copilot surfaces.
- Some packages are more mature than others; for example `packages/ui` is active, while `packages/db` currently looks underused at runtime.
- Existing README and Fumadocs content are helpful context, but the **source tree and module routers** are more reliable.

## High-signal source references

- `/package.json`
- `/pnpm-workspace.yaml`
- `/turbo.json`
- `/apps/web/src/main.tsx`
- `/apps/web/src/routes/_authenticated/route.tsx`
- `/apps/web/src/components/layout/data/sidebar-data.ts`
- `/apps/server/src/index.ts`
- `/apps/server/src/core/infra/bootstrap.ts`
- `/apps/server/src/modules/route-version-api.ts`
- `/apps/ai-services/src/main.py`
- `/apps/ai-services/src/modules/v1/agents/services/coordinator_service.py`
- `/apps/fumadocs/package.json`
- `/apps/fumadocs/source.config.ts`
