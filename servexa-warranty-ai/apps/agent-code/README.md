# Agent code

## Local setup

```bash
python -m venv .venv

# unix shell
source .venv/Scripts/activate
# cmd
.\.venv\Scripts\activate.bat
# PowerShell
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

- Option, update lib into requirment.txt

```bash
pip freeze > requirment.txt
```

## Run API

```bash
fastapi dev --host 0.0.0.0 --port 8081
```

## Run worker

```bash
python -m src.worker
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
