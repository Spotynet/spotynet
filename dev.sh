#!/usr/bin/env bash
# Spotynet landing DEVELOPMENT — shared EC2 (project nginx on 127.0.0.1:3021).
#
# After host nginx once: sudo ./deploy/apply-nginx.sh
# Day-to-day: ./dev.sh
#
# Release flow (separate machines/scripts):
#   ./dev.sh     → hot reload on this box
#   ./build.sh   → build + push image to ECR (builder/dev)
#   ./deploy.sh  → pull + run on prod
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# Public apex, www, and the landing dev alias.
# dev.spotynet.com belongs to Implementaciones (gateway 3025).
SPOTYNET_WEB_HOST="spotynet.com www.spotynet.com spotynet-dev.spotynet.com"

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
echo "Public URL:"
echo "  https://spotynet.com/"
echo
echo "Logs: docker compose -f compose.yaml logs -f"
echo "Stop: docker compose -f compose.yaml down"
echo
echo "If host nginx / DNS missing, once:"
echo "  1) Route 53 A: spotynet.com → this EC2 EIP"
echo "  2) sudo certbot --nginx -d spotynet.com --redirect"
