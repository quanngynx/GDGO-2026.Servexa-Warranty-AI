#!/bin/sh
set -e
cd /app
pnpm --filter @servexa-warranty-ai/db db:deploy
exec pnpm --filter server dev
