# Spotynet landing deploy notes

Three commands:

| Script | Machine | Purpose |
|--------|---------|---------|
| [`./dev.sh`](../dev.sh) | Dev (shared Spotynet EC2) | Local Compose build + hot reload → `127.0.0.1:3021` |
| [`./build.sh`](../build.sh) | Builder / dev | Build prod image → push ECR `apps/spotynet/web` |
| [`./deploy.sh`](../deploy.sh) | Prod only | Pull ECR → up → `127.0.0.1:8080` |

```text
dev:     edit → ./dev.sh
release: ./build.sh          → ECR
prod:    ./deploy.sh         → pull + run
```

No GitHub Actions in the image path. Git is only for source.

## Dev machine

1. Install Docker (+ Compose); user in `docker` group
2. `git clone` / `git pull`
3. Host nginx → `127.0.0.1:3021` (`sudo ./deploy/apply-nginx.sh`)
4. `./dev.sh`

No ECR / `deploy.env` required for pure dev.

```bash
sudo ./deploy/apply-nginx.sh
sudo certbot --nginx -d spotynet.com -d www.spotynet.com --redirect
```

## Build + push

AWS: ECR repo + push IAM — see [aws-ecr.md](aws-ecr.md).

```bash
cp deploy.env.example deploy.env   # once; set AWS_ACCOUNT_ID
git checkout main
./build.sh
# PUSH=0 ./build.sh                       # local tag only; any branch OK
# ALLOW_NON_DEFAULT_BRANCH=1 ./build.sh   # emergency only
```

## Prod machine

```bash
cp deploy.env.example deploy.env       # AWS_ACCOUNT_ID=
# instance role: ECR pull; AWS CLI + Docker installed

SPOTYNET_IMAGE_TAG=<sha_from_build> ./deploy.sh
# or after :main was pushed:
./deploy.sh

sudo ./deploy/setup-prod-nginx.sh
sudo ./deploy/setup-prod-nginx.sh --certbot

./deploy.sh down
```

Do not run `./deploy.sh` on the shared Spotynet EC2.

Compose publishes `127.0.0.1:8080` only. Host nginx + Certbot terminate TLS.

## Image name

```text
${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/apps/spotynet/web:<tag>
```
