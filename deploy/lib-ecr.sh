# Shared ECR helpers for build.sh / deploy.sh. Source from repo root scripts.
# shellcheck shell=bash

load_deploy_env() {
  local root="${1:-.}"
  if [[ -f "${root}/deploy.env" ]]; then
    set -a
    # shellcheck source=/dev/null
    source "${root}/deploy.env"
    set +a
  fi
}

resolve_ecr_registry() {
  AWS_REGION="${AWS_REGION:-us-east-1}"
  SPOTYNET_IMAGE_PREFIX="${SPOTYNET_IMAGE_PREFIX:-apps/spotynet}"

  if [[ -z "${SPOTYNET_IMAGE_REGISTRY:-}" ]]; then
    if [[ -z "${AWS_ACCOUNT_ID:-}" ]]; then
      echo "Set AWS_ACCOUNT_ID (or SPOTYNET_IMAGE_REGISTRY) in deploy.env — see deploy.env.example." >&2
      return 1
    fi
    SPOTYNET_IMAGE_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${SPOTYNET_IMAGE_PREFIX}"
  fi

  # Host for docker login (strip path after first /)
  ECR_HOST="${SPOTYNET_IMAGE_REGISTRY%%/*}"
  export AWS_REGION SPOTYNET_IMAGE_PREFIX SPOTYNET_IMAGE_REGISTRY ECR_HOST
}

ecr_login() {
  if ! command -v aws >/dev/null 2>&1; then
    echo "aws CLI is required for ECR login. Install AWS CLI v2 on this host." >&2
    return 1
  fi
  if [[ -z "${ECR_HOST:-}" || -z "${AWS_REGION:-}" ]]; then
    echo "resolve_ecr_registry must run before ecr_login." >&2
    return 1
  fi
  echo "Logging in to ECR (${ECR_HOST}, region ${AWS_REGION})..."
  aws ecr get-login-password --region "${AWS_REGION}" \
    | docker login --username AWS --password-stdin "${ECR_HOST}"
}
