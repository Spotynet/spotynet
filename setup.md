# Spotynet landing — Setup & Use Guide

Frontend-only Next.js company landing. Nabbi-style Compose + ECR.  
Company playbook: [`../docker-ecr-playbook.md`](../docker-ecr-playbook.md).

## Architecture

```text
DEV (shared EC2)
  Browser → host nginx :443
              → 127.0.0.1:3021
                   project nginx
                     └─ spotynet.com / www.spotynet.com / spotynet-dev.spotynet.com → web:3010 (next dev)

PROD (dedicated EC2)
  Browser → host nginx :443
              → host nginx :80
                   → 127.0.0.1:8080
                        → web:3010 (node server.js from ECR)
```

| | Value |
|--|--------|
| Gateway (dev) | `127.0.0.1:3021` |
| Internal | Next.js `3010` |
| Public domain | `spotynet.com`, `www.spotynet.com`, `spotynet-dev.spotynet.com` (set in `dev.sh`) |
| Prod domains | `spotynet.com` `www.spotynet.com` |
| Image | ECR `apps/spotynet/web` |

**Note:** Host port `3010` belongs to **Jay**. Spotynet uses gateway **3021**. `dev.spotynet.com` and `dev-api.spotynet.com` belong to Implementaciones.

## Three commands

| Script | Machine | What it does |
|--------|---------|----------------|
| `./dev.sh` | Dev / shared EC2 | `compose.yaml` build + bind mount + hot reload |
| `./build.sh` | Builder (often shared EC2) | Build prod image → push ECR |
| `./deploy.sh` | Prod only | Pull ECR → `up` |

```text
edit code  →  ./dev.sh
release    →  git checkout main && ./build.sh
prod       →  ./deploy.sh
```

`./build.sh` refuses an ECR push unless the current branch is the repo default branch (`main`). Local-only: `PUSH=0 ./build.sh`.

## Dev (this machine)

1. **DNS:** Route 53 A records for `spotynet.com` and `www` → this EC2 Elastic IP
2. **Host nginx:** public `server_name spotynet.com www.spotynet.com` → `127.0.0.1:3021` (no IP allowlist)
3. **TLS:** `sudo certbot --nginx -d spotynet.com -d www.spotynet.com --redirect`
4. **Start:** `./dev.sh`

```bash
./dev.sh
docker compose -f compose.yaml logs -f
docker compose -f compose.yaml down
```

URL: `https://spotynet.com/`

Dev does not need ECR or `deploy.env`.

## Build

Needs AWS CLI, an instance role with ECR **push** on `apps/spotynet/*`, and `deploy.env`. See [`deploy/aws-ecr.md`](deploy/aws-ecr.md).

```bash
cp deploy.env.example deploy.env   # AWS_ACCOUNT_ID=...
git checkout main && git pull
./build.sh
```

## Production (dedicated machine)

Do not run `./deploy.sh` on the shared EC2. Compose binds `127.0.0.1:8080` only; host nginx owns `:80`/`:443`.

```bash
cp deploy.env.example deploy.env
SPOTYNET_IMAGE_TAG=<sha> ./deploy.sh
# or ./deploy.sh   # pulls :main by default
sudo ./deploy/setup-prod-nginx.sh
sudo ./deploy/setup-prod-nginx.sh --certbot
./deploy.sh down
```
