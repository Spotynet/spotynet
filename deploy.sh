#!/usr/bin/env bash
# Spotynet landing PRODUCTION deploy — dedicated machine.
#
# Pulls the pre-built image from Amazon ECR (no build on host).
# Build/push the image first with ./build.sh on a builder/dev machine.
#
#   SPOTYNET_IMAGE_TAG=<sha|main> ./deploy.sh
#   ./deploy.sh spotynet.com www.spotynet.com
#   SKIP_GIT_PULL=1 SPOTYNET_IMAGE_TAG=$SHA ./deploy.sh
#
# Non-secret registry config: deploy.env (see deploy.env.example).
# For development, use ./dev.sh. Do NOT run this on the shared Spotynet EC2.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# shellcheck source=deploy/lib-ecr.sh
source "$ROOT/deploy/lib-ecr.sh"

load_deploy_env "$ROOT"
resolve_ecr_registry

SPOTYNET_IMAGE_TAG="${SPOTYNET_IMAGE_TAG:-main}"

# === Production domain(s) — space-separated server_name ===
SPOTYNET_WEB_HOST="${SPOTYNET_WEB_HOST:-spotynet.com www.spotynet.com}"

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
export SPOTYNET_IMAGE_REGISTRY SPOTYNET_IMAGE_TAG AWS_REGION

if [[ "${SKIP_GIT_PULL:-0}" != "1" ]]; then
  echo "Pulling latest from git..."
  git pull --ff-only
fi

echo "Deploying Spotynet PRODUCTION (pull ECR image → 127.0.0.1:8080)..."
echo "  registry: ${SPOTYNET_IMAGE_REGISTRY}"
echo "  tag:      ${SPOTYNET_IMAGE_TAG}"
echo "  web:      ${SPOTYNET_WEB_HOST}"
echo
echo "Do not run this on the shared Spotynet multi-app EC2."

ecr_login

echo "Pulling images..."
if ! compose -f compose.yaml -f compose.prod.yaml pull web nginx; then
  echo "Image pull failed. Check EC2 instance role ECR pull permissions (see deploy/aws-ecr.md)." >&2
  exit 1
fi

echo "Starting stack..."
compose -f compose.yaml -f compose.prod.yaml up -d --remove-orphans
echo
compose -f compose.yaml -f compose.prod.yaml ps
echo
echo "Compose nginx is on 127.0.0.1:8080 (host nginx should own :80/:443)."
echo "First-time TLS on this host:"
echo "  sudo ./deploy/setup-prod-nginx.sh           # HTTP proxy"
echo "  sudo ./deploy/setup-prod-nginx.sh --certbot # + Let's Encrypt"
echo
echo "Check (HTTP via host nginx):"
echo "  curl -sI -H 'Host: ${SPOTYNET_WEB_HOST%% *}' http://127.0.0.1/ | head -3"
echo
echo "Rollback: SPOTYNET_IMAGE_TAG=<previous_sha> ./deploy.sh"
echo "Logs: docker compose -f compose.yaml -f compose.prod.yaml logs -f"
echo "Stop: ./deploy.sh down"
