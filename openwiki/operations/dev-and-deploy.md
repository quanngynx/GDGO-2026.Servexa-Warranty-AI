# Development and deployment

## Monorepo workflow

The root `package.json` is the main command index.

Common commands:

- `pnpm dev` — run Turbo dev tasks
- `pnpm build` — monorepo build
- `pnpm check-types` — monorepo type checks
- `pnpm dev:web` — web only
- `pnpm dev:server` — server only
- `pnpm dev:docker-compose` — local Postgres + Redis
- `pnpm db:push`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm db:studio`
- `pnpm deploy`, `pnpm destroy` — infra package entrypoints

Turbo config (`/turbo.json`) disables caching for many DB/test/deploy tasks and marks dev/database watch tasks as persistent.

## Local dependencies

### Postgres + Redis

`/docker-compose.yml` starts:

- Postgres using a `pgvector` image
- Redis with password protection and local binding

This is the expected local substrate for the server and AI services.

### Server

The server README (`/apps/server/README.md`) documents:

- production image build via `apps/server/Dockerfile`
- dev stack with bind-mounted hot reload
- optional Infisical-based secret injection

Do not copy or inspect live secret values; document only the mechanism.

### AI services

The AI-services README (`/apps/ai-services/README.md`) documents:

- Python venv setup
- FastAPI dev server on port 8081
- worker startup
- Redis stream consumer startup
- pytest usage
- Docker Compose usage
- Cloud Run deployment shape

A notable integration detail: Node expects the AI gRPC service on the configured `grpc_port` (default 50051) while FastAPI serves HTTP on 8081.

## App-specific dev/test surfaces

### Web app

`/apps/web/package.json` includes:

- `build`
- `serve`
- `start`
- `check-types`
- `test`
- browser smoke tests

The web app also has new i18n helper scripts in the working tree (`extract-i18n.mjs`, `translate-vi.mjs`, etc.), which indicates localization work is active but not fully stabilized.

### Server

`/apps/server/package.json` includes:

- `dev`, `build`, `start`
- `test`, `test:watch`, `test:coverage`
- Prisma generation/migration/seed/reset
- optional compiled binary build via Bun

There are both unit and integration tests across middleware, identity, and AI modules.

### AI services

`/apps/ai-services/pyproject.toml` and README indicate:

- Python 3.11+
- pytest test suite under `tests/`
- FastAPI entrypoint `src.main:app`

## Seed and fixture strategy

The seed orchestration in `/apps/server/prisma/seeds/index.ts` is important for reproducible local environments. It establishes users, permissions, catalog data, ASC centers, HR data, purchase channels, repair cases, warranties, stock, financials, and recalls.

When future agents need realistic local data, start with the seed pipeline instead of hand-creating rows.

## Deployment hints

### Web deployment

Recent history shows serious work on containerization and Nginx:

- `9980304` enhanced Docker + Nginx setup and entrypoint templating for the web app

Relevant files:

- `/apps/web/Dockerfile`
- `/.docker/web/nginx.conf`
- `/.docker/web/nginx.conf.template`
- `/.docker/web/docker-entrypoint.sh`
- `/docker-compose.prod.yml`

### Server deployment

The server has both `Dockerfile` and `Dockerfile.dev`, plus production compose integration.

### AI deployment

AI services include:

- `Dockerfile.api`
- `Dockerfile.worker`
- Cloud Run YAMLs
- docker-compose files

This suggests API and worker roles are deployable independently.

## Documentation and maintenance caveats

- Root README is useful context, but code paths are moving quickly.
- There are uncommitted local changes in docs and workflow files; future agents should run `git status --short` before making assumptions.
- The repo contains security- and secret-related files (`.env`, `.env.production`, `secrets/`). Do not read them for docs.
- The Fumadocs app exists, but generated/template pages mean it should not be treated as authoritative without verification.

## Recommended change workflow for future agents

### For UI changes

Inspect first:

- `/apps/web/src/features/...`
- `/apps/web/src/routes/...`
- `/packages/ui/src/components/...`

Then verify with:

- `pnpm -F web test`
- `pnpm -F web check-types`

### For backend/domain changes

Inspect first:

- relevant `/apps/server/src/modules/v1/...` module
- `/apps/server/prisma/schema/schema.prisma`
- seed files if the change touches test/demo data

Then verify with:

- `pnpm -F server test`
- `pnpm -F server check-types`
- Prisma generate/migrate as needed

### For AI changes

Inspect first:

- Node AI module in `/apps/server/src/modules/v1/ai`
- Python AI module in `/apps/ai-services/src/modules/v1`
- shared contracts in `/packages/ai-contracts` and `/packages/proto`

Then verify with:

- server tests for REST/HITL contract behavior
- `pytest` for Python service behavior where applicable
- targeted manual flow through copilot UI when the change affects user experience

## Source anchors

- `/package.json`
- `/turbo.json`
- `/docker-compose.yml`
- `/docker-compose.prod.yml`
- `/apps/web/package.json`
- `/apps/server/package.json`
- `/apps/ai-services/pyproject.toml`
- `/apps/server/README.md`
- `/apps/ai-services/README.md`
- `/apps/web/Dockerfile`
- `/apps/server/prisma/seeds/index.ts`
