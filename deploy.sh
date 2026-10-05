#!/usr/bin/env bash
# Spotynet landing PRODUCTION — dedicated machine (project nginx on host :80).
#
# After merge to main:
#   ./deploy.sh
#
# Domain at top, or: ./deploy.sh "spotynet.com www.spotynet.com"
# Do NOT run on the shared Spotynet multi-app EC2 (binds :80).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# === Production domain(s) — space-separated OK ===
SPOTYNET_WEB_HOST="spotynet.com www.spotynet.com"

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

if [[ "${1:-}" == "down" ]]; then
  echo "Stopping Spotynet PRODUCTION..."
  compose -f compose.yaml -f compose.prod.yaml down
  exit 0
fi

if [[ $# -ge 1 ]]; then
  SPOTYNET_WEB_HOST="$*"
fi

export SPOTYNET_WEB_HOST

echo "Pulling latest from git..."
git pull --ff-only

echo "Deploying Spotynet PRODUCTION → :80..."
echo "  ${SPOTYNET_WEB_HOST}"
compose -f compose.yaml -f compose.prod.yaml up -d --build
echo
compose -f compose.yaml -f compose.prod.yaml ps
echo
echo "PRODUCTION URL(s) (add TLS in front of :80 if needed):"
echo "  http://${SPOTYNET_WEB_HOST%% *}/"
echo
echo "Stop: ./deploy.sh down"
