#!/bin/sh
# docker-entrypoint.sh — Servexa Warranty AI web container entrypoint.
# Copies Nginx config from the read-only source directory to the writable
# /etc/nginx (tmpfs in production compose), processes the template with
# envsubst, then starts Nginx.
set -eu

# Default: no extra connect-src origins (only 'self' in CSP)
: "${CSP_CONNECT_SRC:=}"

# Source directory containing read-only config files baked into the image.
# The compose mounts /etc/nginx as tmpfs (for read_only: true), so we need
# to copy the base configs + mime.types from the image-baked source.
SRC_DIR="/etc/nginx-src"

# Copy base Nginx files if the source directory exists (read_only + tmpfs mode)
# Use cp -r (not -a) since we run as nginx user and can't preserve root ownership
if [ -d "$SRC_DIR" ] && [ ! -f /etc/nginx/nginx.conf.template ]; then
  cp -r "$SRC_DIR"/. /etc/nginx/
fi

# Process the template: substitute ONLY ${CSP_CONNECT_SRC}, preserve Nginx $vars
envsubst '${CSP_CONNECT_SRC}' \
  < /etc/nginx/nginx.conf.template \
  > /etc/nginx/nginx.conf

echo "[entrypoint] CSP connect-src: 'self' ${CSP_CONNECT_SRC:-<none>}"
echo "[entrypoint] Starting Nginx..."

exec nginx -g 'daemon off;'
