# syntax=docker/dockerfile:1.7

# ┌─────────────────────────────────────────────────────────────────────────────┐
# │ Servexa Warranty AI — Web (Vite React SPA)                                 │
# │                                                                            │
# │ OWASP Docker Cheat Sheet compliance:                                       │
# │   RULE #1  — No secrets baked into image                                   │
# │   RULE #2  — Minimal base (Alpine Nginx for runtime, bookworm-slim build)  │
# │   RULE #3  — Multi-stage build (only static assets in final image)         │
# │   RULE #4  — Non-root runtime (nginx UID 101)                              │
# │   RULE #5  — Digest-pinned base images                                     │
# │   RULE #6  — cap_drop ALL in compose (no setuid/setgid binaries needed)    │
# │   RULE #8  — No package manager cache in final image                       │
# │   RULE #9  — COPY, never ADD                                               │
# │   RULE #10 — OCI metadata labels                                           │
# │   RULE #12 — STOPSIGNAL SIGQUIT (Nginx graceful shutdown)                  │
# │                                                                            │
# │ Build from repo root:                                                      │
# │   docker build -f apps/web/Dockerfile -t servexa-web .                     │
# │                                                                            │
# │ Digest refresh:                                                            │
# │   docker buildx imagetools inspect node:24.16.0-bookworm-slim \            │
# │     --format "{{.Manifest.Digest}}"                                        │
# │   docker buildx imagetools inspect nginx:1.28-alpine \                     │
# │     --format "{{.Manifest.Digest}}"                                        │
# └─────────────────────────────────────────────────────────────────────────────┘

# ── Pinned base images ──────────────────────────────────────────────────────
ARG NODE_IMAGE=node:24.16.0-bookworm-slim
ARG NODE_DIGEST=sha256:242549cd46785b480c832479a730f4f2a20865d61ea2e404fdb2a5c3d3b73ecf
ARG NGINX_IMAGE=nginx:1.28-alpine
ARG NGINX_DIGEST=sha256:a8b39bd9cf0f83869a2162827a0caf6137ddf759d50a171451b335cecc87d236
ARG PNPM_VERSION=10.28.1

# ── Build arg: VITE_SERVER_URL is baked into the SPA at build time ──────────
# The web app validates this as a URL (z.url()). Set to the production domain
# where Nginx serves the app. The SPA makes requests to this origin/api/ and
# Nginx proxies them to the backend container.
# Example: docker build --build-arg VITE_SERVER_URL=https://app.servexa.com ...
ARG VITE_SERVER_URL="http://localhost:8080"

# ════════════════════════════════════════════════════════════════════════════
# Stage 1: base — pnpm + corepack on bookworm-slim
# ════════════════════════════════════════════════════════════════════════════
FROM ${NODE_IMAGE}@${NODE_DIGEST} AS base
ARG PNPM_VERSION
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN --mount=type=cache,id=corepack-cache,target=/root/.cache/corepack \
  corepack enable \
  && corepack prepare pnpm@${PNPM_VERSION} --activate \
  && pnpm config set store-dir /pnpm/store
WORKDIR /app

# ════════════════════════════════════════════════════════════════════════════
# Stage 2: deps — install dependencies (frozen lockfile)
# ════════════════════════════════════════════════════════════════════════════
FROM base AS deps

# Copy workspace root manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
# Flat node_modules so Vite resolves packages from /app/node_modules
RUN echo "node-linker=hoisted" > .npmrc

# All workspace package.json stubs so frozen-lockfile matches importers
COPY apps/web/package.json apps/web/
COPY apps/server/package.json apps/server/
COPY apps/fumadocs/package.json apps/fumadocs/
COPY packages/ai-contracts/package.json packages/ai-contracts/
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/env/package.json packages/env/
COPY packages/event-contracts/package.json packages/event-contracts/
COPY packages/infra/package.json packages/infra/
COPY packages/proto/package.json packages/proto/
COPY packages/ui/package.json packages/ui/

# Symlink workspace packages that web depends on
RUN mkdir -p node_modules/@servexa-warranty-ai \
  && ln -s ../../packages/env node_modules/@servexa-warranty-ai/env \
  && ln -s ../../packages/ui node_modules/@servexa-warranty-ai/ui \
  && ln -s ../../packages/ai-contracts node_modules/@servexa-warranty-ai/ai-contracts

# Install all deps for web and its workspace dependencies
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
  pnpm install --frozen-lockfile --filter web... --filter servexa-warranty-ai --ignore-scripts

# ════════════════════════════════════════════════════════════════════════════
# Stage 3: build — compile the Vite SPA
# ════════════════════════════════════════════════════════════════════════════
FROM deps AS build
ARG VITE_SERVER_URL
ENV CI=true
ENV VITE_SERVER_URL=${VITE_SERVER_URL}
ENV VITE_NODE_ENV=production

# Copy web app source and workspace packages it depends on
COPY apps/web apps/web
COPY packages/ai-contracts packages/ai-contracts
COPY packages/config packages/config
COPY packages/env packages/env
COPY packages/ui packages/ui

# Re-create symlinks (COPY overwrites the node_modules directory structure)
RUN mkdir -p node_modules/@servexa-warranty-ai \
  && ln -s ../../packages/env node_modules/@servexa-warranty-ai/env \
  && ln -s ../../packages/ui node_modules/@servexa-warranty-ai/ui \
  && ln -s ../../packages/ai-contracts node_modules/@servexa-warranty-ai/ai-contracts

# Build the SPA — produces apps/web/dist/ with static HTML/CSS/JS
RUN pnpm turbo run build --filter=web...

# ════════════════════════════════════════════════════════════════════════════
# Stage 4: runtime — Nginx Alpine serving static assets
# ════════════════════════════════════════════════════════════════════════════
FROM ${NGINX_IMAGE}@${NGINX_DIGEST} AS runtime

# ── OCI metadata labels (OWASP RULE #10) ────────────────────────────────
LABEL org.opencontainers.image.title="servexa-warranty-ai-web" \
      org.opencontainers.image.description="Servexa Warranty AI — Web SPA (Nginx)" \
      org.opencontainers.image.source="https://github.com/quanngynx/servexa-warranty-ai" \
      org.opencontainers.image.licenses="MIT"

# Remove the default Nginx site config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy the Nginx config and entrypoint
COPY .docker/web/nginx.conf.template /etc/nginx/nginx.conf.template
COPY .docker/web/nginx.conf          /etc/nginx/nginx.conf
COPY .docker/web/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# For read_only + tmpfs mode (production compose), the entrypoint copies
# configs from this read-only source directory to /etc/nginx at startup.
# This preserves mime.types and custom configs when /etc/nginx is tmpfs.
RUN cp -a /etc/nginx /etc/nginx-src

# Create required directories writable by nginx user (UID 101 in Alpine)
# These are also mounted as tmpfs in compose for read_only mode
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx /tmp \
  && chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx /tmp \
  && chown nginx:nginx /etc/nginx/nginx.conf

# Copy static SPA assets from build stage — owned by nginx user
COPY --from=build --chown=nginx:nginx /app/apps/web/dist /usr/share/nginx/html

# ── Non-root runtime (OWASP RULE #4) ────────────────────────────────────
USER nginx

EXPOSE 8080

# ── Healthcheck (OWASP RULE #7) ─────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/_health || exit 1

# ── Graceful shutdown (OWASP RULE #12) ──────────────────────────────────
STOPSIGNAL SIGQUIT

ENTRYPOINT ["/docker-entrypoint.sh"]
