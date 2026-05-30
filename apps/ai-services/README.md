# AI Services

## Local setup

```bash
python -m venv .venv

# unix shell
source .venv/Scripts/activate
# cmd
.\.venv\Scripts\activate.bat
# PowerShell
.\.venv\Scripts\Activate.ps1

python -m pip install -r requirements.txt
```

- Option, update lib into requirment.txt

```bash
python -m pip freeze > requirment.txt
```

## Run API

Starts FastAPI on port **8081** and the **gRPC `ai.v1.AiService`** server on **`grpc_port`** (default **50051**, same port Node uses when `AI_GRPC_HOST` points at this service).

```bash
fastapi dev --port 8081
```

- Options, run app with infisical. Before running, setup secret at <https://app.infisical.com/>

```bash
infisical run --env=dev -- fastapi dev --port 8081
```

Imports such as `configs` and `core` resolve from the `src/` directory (see `src/__init__.py`). If you run Uvicorn directly, set `PYTHONPATH=src` (or `src` on `sys.path`) the same way pytest does in `pyproject.toml`.

## Run worker

Requires Redis (monorepo: `pnpm db:start` exposes Redis on **6381**). Set `REDIS_URL=redis://localhost:6381/0` if not using the default.

```bash
python -m src.worker
```

## Run AI job stream consumer (Redis → coordinator)

Processes jobs published by the Node `AiJobStreamService` (`ai.*.stream` keys). Set `REDIS_URL` to match the ERP server (for example `redis://localhost:6381/0` when using monorepo Docker).

For **`knowledge_ingest`** jobs, also set **`ERP_INTERNAL_BASE_URL`** (Node server base URL, e.g. `http://localhost:3000`) and **`AI_INTERNAL_INGEST_SECRET`** (must match the Node `AI_INTERNAL_INGEST_SECRET`).

```bash
python -m src.worker_ai_jobs
```

## Run tests

```bash
pytest
```

## Docker

### Setup Secrets

1. Create a `secrets/` directory:
```bash
mkdir -p secrets
```

2. Create secret files with your credentials:
```bash
echo "langchain" > secrets/postgres_user.txt
echo "your_secure_password" > secrets/postgres_password.txt
chmod 600 secrets/*.txt
```

3. Run services:
```bash
docker compose up --build
```

This will start:
- PostgreSQL with pgvector (port 6024)
- Redis (port 6379)
- API service (port 8081)
- Worker service

## Cloud Run Deployment

### Setup Google Cloud Secrets

Create the required secrets in Google Cloud Secrets Manager:

```bash
# Set your values first
POSTGRES_HOST="your-cloudsql-host"
POSTGRES_USER="langchain"
POSTGRES_PASSWORD="your_secure_password"
REDIS_URL="redis://your-redis-host:6379/0"

# Create secrets
echo -n "$POSTGRES_HOST" | gcloud secrets create ai-postgres-host --data-file=-
echo -n "$POSTGRES_USER" | gcloud secrets create ai-postgres-user --data-file=-
echo -n "$POSTGRES_PASSWORD" | gcloud secrets create ai-postgres-password --data-file=-
echo -n "$REDIS_URL" | gcloud secrets create ai-redis-url --data-file=-
```

### Grant Permissions

Grant the Cloud Run service accounts access to the secrets:

```bash
PROJECT_ID=$(gcloud config get-value project)

# For API service
gcloud secrets add-iam-policy-binding ai-postgres-host \
  --member=serviceAccount:ai-api-sa@${PROJECT_ID}.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Repeat for other secrets and ai-worker-sa
```

### Deploy

```bash
# Build and push images
docker build -f Dockerfile.api -t gcr.io/PROJECT_ID/ai-api-service:latest .
docker push gcr.io/PROJECT_ID/ai-api-service:latest

# Deploy
gcloud run services replace cloudrun.api.yaml --region=us-central1
```
