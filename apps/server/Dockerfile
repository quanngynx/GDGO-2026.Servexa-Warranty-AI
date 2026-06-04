# syntax=docker/dockerfile:1.7

# OWASP Node.js Docker: pinned base, multi-stage build, prod-only deps, non-root runtime.
# Build from repo root: docker build -f apps/server/Dockerfile -t servexa-server .
# Digest: docker buildx imagetools inspect node:24.16.0-bookworm-slim --format "{{.Manifest.Digest}}"

ARG NODE_IMAGE=node:24.16.0-bookworm-slim
ARG NODE_DIGEST=sha256:242549cd46785b480c832479a730f4f2a20865d61ea2e404fdb2a5c3d3b73ecf
ARG PNPM_VERSION=10.28.1

FROM ${NODE_IMAGE}@${NODE_DIGEST} AS base
ARG PNPM_VERSION
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN --mount=type=cache,id=corepack-cache,target=/root/.cache/corepack \
  corepack enable \
  && corepack prepare pnpm@${PNPM_VERSION} --activate \
  && pnpm config set store-dir /pnpm/store
WORKDIR /app

FROM base AS deps
RUN --mount=type=cache,id=apt-deps-cache,target=/var/cache/apt,sharing=locked \
  apt-get update \
  && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    openssl \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
# Flat node_modules so `node dist/index.mjs` resolves packages from /app/node_modules.
RUN echo "node-linker=hoisted" > .npmrc
# All workspace package.json stubs so frozen-lockfile matches pnpm-lock.yaml importers.
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
COPY apps/fumadocs/package.json apps/fumadocs/
COPY packages/ai-contracts/package.json packages/ai-contracts/
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/env/package.json packages/env/
COPY packages/event-contracts/package.json packages/event-contracts/
COPY packages/infra/package.json packages/infra/
COPY packages/proto/package.json packages/proto/
COPY packages/ui/package.json packages/ui/
RUN mkdir -p node_modules/@servexa-warranty-ai \
  && ln -s ../../packages/env node_modules/@servexa-warranty-ai/env \
  && ln -s ../../packages/proto node_modules/@servexa-warranty-ai/proto \
  && ln -s ../../packages/ai-contracts node_modules/@servexa-warranty-ai/ai-contracts \
  && ln -s ../../packages/event-contracts node_modules/@servexa-warranty-ai/event-contracts
# Skip postinstall (prisma generate) until apps/server sources are copied in the build stage.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
  pnpm install --frozen-lockfile --filter server... --filter servexa-warranty-ai --ignore-scripts

FROM deps AS build
ENV CI=true
# Prisma generate only needs a syntactically valid URL at build time.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
COPY apps/server apps/server
COPY packages/ai-contracts packages/ai-contracts
COPY packages/config packages/config
COPY packages/env packages/env
COPY packages/event-contracts packages/event-contracts
COPY packages/proto packages/proto
RUN mkdir -p node_modules/@servexa-warranty-ai \
  && ln -s ../../packages/env node_modules/@servexa-warranty-ai/env \
  && ln -s ../../packages/proto node_modules/@servexa-warranty-ai/proto \
  && ln -s ../../packages/ai-contracts node_modules/@servexa-warranty-ai/ai-contracts \
  && ln -s ../../packages/event-contracts node_modules/@servexa-warranty-ai/event-contracts
RUN pnpm --filter server db:generate
RUN pnpm turbo run build --filter=server...
# Native addons (bcrypt, sharp): deps used --ignore-scripts, so run their install scripts explicitly.
RUN npm --prefix /app/node_modules/bcrypt run install \
  && npm --prefix /app/node_modules/sharp run install
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
  pnpm prune --prod
RUN npm --prefix /app/node_modules/bcrypt run install \
  && npm --prefix /app/node_modules/sharp run install

FROM ${NODE_IMAGE}@${NODE_DIGEST} AS production
RUN --mount=type=cache,id=apt-production-cache,target=/var/cache/apt,sharing=locked \
  apt-get update \
  && apt-get install -y --no-install-recommends \
    dumb-init \
    openssl \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --gid 1001 nodejs \
  && useradd --uid 1001 --gid nodejs --shell /usr/sbin/nologin --create-home nodejs

ENV NODE_ENV=production
STOPSIGNAL SIGTERM

WORKDIR /app

COPY --from=build --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nodejs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build --chown=nodejs:nodejs /app/.npmrc ./.npmrc
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=build --chown=nodejs:nodejs /app/apps/server/package.json ./apps/server/package.json

RUN mkdir -p apps/server/uploads apps/server/logs \
  && chown -R nodejs:nodejs apps/server/uploads apps/server/logs

USER nodejs

WORKDIR /app/apps/server

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD ["node", "-e", "const p=Number(process.env.PORT||3000);fetch(`http://127.0.0.1:${p}/health`).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.mjs"]
