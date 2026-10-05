#!/usr/bin/env bash
# One-shot shared-EC2 bootstrap for Spotynet landing (requires sudo).
# Usage: sudo ./deploy/bootstrap-shared.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ $EUID -ne 0 ]]; then
  echo "Run with sudo: sudo $0" >&2
  exit 1
fi

RUN_USER="${SUDO_USER:-spotynet}"

echo "==> Applying host nginx Spotynet landing (dev.spotynet.com → 3021)"
bash "$ROOT/deploy/apply-nginx.sh"

usermod -aG docker "$RUN_USER" 2>/dev/null || true

echo "==> Starting Compose"
cd "$ROOT"
if id -nG "$RUN_USER" 2>/dev/null | grep -qw docker; then
  runuser -u "$RUN_USER" -- env HOME="$(getent passwd "$RUN_USER" | cut -d: -f6)" \
    bash -lc "cd '$ROOT' && ./dev.sh"
else
  export SPOTYNET_WEB_HOST="dev.spotynet.com"
  export SPOTYNET_WEB_HOST_ALT="dev.spotynet.com"
  pm2 delete spotynet-dev 2>/dev/null || true
  docker compose -f compose.yaml up -d --build
fi

echo
docker compose -f "$ROOT/compose.yaml" ps
echo
echo "DNS: dig +short dev.spotynet.com   # must be this EC2 EIP"
echo "TLS: sudo certbot --nginx -d dev.spotynet.com --redirect"
