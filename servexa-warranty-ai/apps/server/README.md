# Server

## Docker

Production image (from repo root):

```bash
docker build -f apps/server/Dockerfile -t servexa-server .
```

Development stack with bind-mount hot reload (Postgres, Redis, server):

```bash
pnpm dev:server:docker
```

Requires `apps/server/.env` and Docker Desktop running. Debugger port `9229` is exposed; set `NODE_OPTIONS=--inspect=0.0.0.0:9229` in compose if needed.

## Setup env

### Use infisical to inject secrets

- Install by using winget

```bash
winget install infisical
```

- For other installation, check at <https://infisical.com/docs/cli/overview#installation>

- Setup env in infisical

- Login

```bash
infisical login
```

- Run app with infisical

```bash
infisical run --env=dev -- pnpm dev
```
