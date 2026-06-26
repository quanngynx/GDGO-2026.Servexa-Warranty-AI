#!/bin/sh
set -eu

: "${INFISICAL_PROJECT_ID:?Missing INFISICAL_PROJECT_ID}"
: "${INFISICAL_SECRET_ENV:=prod}"
: "${INFISICAL_SECRET_PATH:?Missing INFISICAL_SECRET_PATH}"
: "${INFISICAL_API_URL:=https://app.infisical.com}"
: "${INFISICAL_MACHINE_IDENTITY_ID:?Missing INFISICAL_MACHINE_IDENTITY_ID}"

export INFISICAL_DISABLE_UPDATE_CHECK=true

echo "Authenticating to Infisical with GCP ID Token..."

INFISICAL_TOKEN="$(
  infisical login \
    --method=gcp-id-token \
    --machine-identity-id="$INFISICAL_MACHINE_IDENTITY_ID" \
    --domain="$INFISICAL_API_URL" \
    --plain \
    --silent
)"

export INFISICAL_TOKEN

echo "Starting ai-services with Infisical secrets..."

exec infisical run \
  --token="$INFISICAL_TOKEN" \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env="$INFISICAL_SECRET_ENV" \
  --path="$INFISICAL_SECRET_PATH" \
  --domain="$INFISICAL_API_URL" \
  -- "$@"