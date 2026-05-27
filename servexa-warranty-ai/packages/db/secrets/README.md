# Database Docker secrets

File-based secrets for `docker-compose.production.yml` (OWASP Docker RULE #12).  
Do not commit real values; this directory is gitignored except this README.

| File | Purpose |
|------|---------|
| `postgres_user.txt` | PostgreSQL role name (no trailing newline required) |
| `postgres_password.txt` | PostgreSQL password (**plaintext**; used by the official Postgres image at init) |
| `postgres_db.txt` | Database name |
| `postgres_port.txt` | Host port published on `127.0.0.1` (default `5436`) |

## Create secrets (example)

```bash
cd packages/db
mkdir -p secrets
printf '%s' 'admin' > secrets/postgres_user.txt
printf '%s' 'change-me-use-a-strong-password' > secrets/postgres_password.txt
printf '%s' 'servexa_warranty_ai_db' > secrets/postgres_db.txt
printf '%s' '5436' > secrets/postgres_port.txt
chmod 600 secrets/*.txt
```

## Start production Postgres

```bash
# Optional: align compose host port with postgres_port.txt
export POSTGRES_HOST_PORT="$(tr -d '\r\n' < secrets/postgres_port.txt)"

pnpm --filter @servexa-warranty-ai/db db:start:production
```

`DATABASE_URL` for apps must use the same user, password, database, and host port.

## Image updates

Production uses a **digest-pinned** `pgvector/pgvector:0.8.2-pg18-bookworm` image (Debian 12 stable).  
After pulling a patched tag, update `docker/postgres/image.lock` and the `@sha256:…` reference in `docker-compose.production.yml`:

```bash
docker buildx imagetools inspect pgvector/pgvector:0.8.2-pg18-bookworm --format "{{.Manifest.Digest}}"
```
