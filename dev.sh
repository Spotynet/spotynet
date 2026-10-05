#!/usr/bin/env bash
# Spotynet landing DEVELOPMENT — shared EC2 (project nginx on 127.0.0.1:3021).
#
# After host nginx once: sudo ./deploy/apply-nginx.sh
# Day-to-day: ./dev.sh
#
# For production on a dedicated machine: ./deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# === Dev domain (committed; shared EC2) ===
SPOTYNET_WEB_HOST="dev.spotynet.com"

export SPOTYNET_WEB_HOST

compose() {
  if docker info >/dev/null 2>&1; then
    docker compose "$@"
  elif sudo -n docker info >/dev/null 2>&1; then
    sudo docker compose "$@"
  else
    echo "Docker needs privileges. Prefer: sudo usermod -aG docker \$USER && newgrp docker" >&2
    sudo docker compose "$@"
  fi
}

echo "Cleaning old Spotynet PM2 process (if any)..."
pm2 delete spotynet-dev 2>/dev/null || true
pm2 save 2>/dev/null || true

echo "Starting Spotynet DEV (compose.yaml → 127.0.0.1:3021)..."
echo "  ${SPOTYNET_WEB_HOST}"
compose -f compose.yaml up -d --build
echo
compose -f compose.yaml ps
echo
echo "DEV URL:"
echo "  https://${SPOTYNET_WEB_HOST}/"
echo
echo "Logs: docker compose -f compose.yaml logs -f"
echo "Stop: docker compose -f compose.yaml down"
echo
echo "If host nginx / DNS missing, once:"
echo "  1) Route 53 A: dev.spotynet.com → this EC2 EIP"
echo "  2) sudo ./deploy/apply-nginx.sh"
echo "  3) sudo certbot --nginx -d dev.spotynet.com --redirect"
