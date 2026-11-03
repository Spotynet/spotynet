#!/usr/bin/env bash
# Spotynet landing — build the production image and push to Amazon ECR.
#
# Run on a builder/dev machine (Docker + AWS CLI + ECR push IAM). Prefer not on prod.
#
#   ./build.sh
#   SPOTYNET_IMAGE_TAG=v1.2.3 ./build.sh
#   PUSH=0 ./build.sh                          # build/tag only (any branch OK)
#
# Push to ECR is only allowed on the repo default branch (origin/HEAD, currently
# main). Override only in emergencies: ALLOW_NON_DEFAULT_BRANCH=1 ./build.sh
#
# Requires deploy.env with AWS_ACCOUNT_ID (see deploy.env.example).
# After push, on prod: SPOTYNET_IMAGE_TAG=<tag> ./deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# shellcheck source=deploy/lib-ecr.sh
source "$ROOT/deploy/lib-ecr.sh"

load_deploy_env "$ROOT"
resolve_ecr_registry

# Default branch from remote (falls back to main)
DEFAULT_BRANCH="$(git symbolic-ref -q refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || true)"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

PUSH="${PUSH:-1}"
ALLOW_NON_DEFAULT_BRANCH="${ALLOW_NON_DEFAULT_BRANCH:-0}"
SKIP_BRANCH_TAG="${SKIP_BRANCH_TAG:-0}"

if [[ "$PUSH" == "1" && "$CURRENT_BRANCH" != "$DEFAULT_BRANCH" && "$ALLOW_NON_DEFAULT_BRANCH" != "1" ]]; then
  echo "Refusing to push ECR images from branch '${CURRENT_BRANCH}'." >&2
  echo "Checkout the default branch '${DEFAULT_BRANCH}' first (keeps git and images aligned)." >&2
  echo "Local-only build: PUSH=0 ./build.sh" >&2
  echo "Emergency override: ALLOW_NON_DEFAULT_BRANCH=1 ./build.sh" >&2
  exit 1
fi

# Tag: explicit env, else full git SHA
if [[ -z "${SPOTYNET_IMAGE_TAG:-}" ]]; then
  SPOTYNET_IMAGE_TAG="$(git rev-parse HEAD)"
fi

docker_cmd() {
  if docker info >/dev/null 2>&1; then
    docker "$@"
  elif sudo -n docker info >/dev/null 2>&1; then
    sudo docker "$@"
  else
    echo "Docker needs privileges. Prefer: sudo usermod -aG docker \$USER && newgrp docker" >&2
    sudo docker "$@"
  fi
}

echo "Building Spotynet image for ECR..."
echo "  branch:   ${CURRENT_BRANCH} (default: ${DEFAULT_BRANCH})"
echo "  registry: ${SPOTYNET_IMAGE_REGISTRY}"
echo "  tag:      ${SPOTYNET_IMAGE_TAG}"

IMAGE="${SPOTYNET_IMAGE_REGISTRY}/web"

echo "==> web"
docker_cmd build \
  -f docker/web/Dockerfile \
  --target production \
  -t "${IMAGE}:${SPOTYNET_IMAGE_TAG}" \
  .

if [[ "$SKIP_BRANCH_TAG" != "1" && "${SPOTYNET_IMAGE_TAG}" != "${DEFAULT_BRANCH}" ]]; then
  docker_cmd tag "${IMAGE}:${SPOTYNET_IMAGE_TAG}" "${IMAGE}:${DEFAULT_BRANCH}"
fi

if [[ "$PUSH" != "1" ]]; then
  echo "PUSH=0 — skipping ECR login/push."
  echo "Local tag: ${IMAGE}:${SPOTYNET_IMAGE_TAG}"
  exit 0
fi

ecr_login

echo "==> push web:${SPOTYNET_IMAGE_TAG}"
docker_cmd push "${IMAGE}:${SPOTYNET_IMAGE_TAG}"
if [[ "$SKIP_BRANCH_TAG" != "1" && "${SPOTYNET_IMAGE_TAG}" != "${DEFAULT_BRANCH}" ]]; then
  echo "==> push web:${DEFAULT_BRANCH}"
  docker_cmd push "${IMAGE}:${DEFAULT_BRANCH}"
fi

echo
echo "Pushed:"
echo "  ${IMAGE}:${SPOTYNET_IMAGE_TAG}"
if [[ "$SKIP_BRANCH_TAG" != "1" && "${SPOTYNET_IMAGE_TAG}" != "${DEFAULT_BRANCH}" ]]; then
  echo "  (+ :${DEFAULT_BRANCH})"
fi
echo
echo "On prod:"
echo "  SPOTYNET_IMAGE_TAG=${SPOTYNET_IMAGE_TAG} ./deploy.sh"
echo "  # or: ./deploy.sh   # uses :${DEFAULT_BRANCH} if that is SPOTYNET_IMAGE_TAG in deploy.env"
