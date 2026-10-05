# Spotynet landing — Setup & Use Guide

Frontend-only Next.js company landing. Jay-style Compose pattern.  
Company playbook: [`../setup.md`](../setup.md).

## Architecture (shared EC2 / this machine)

```text
Browser → host nginx
  → 127.0.0.1:3021 (project nginx)
       └─ dev.spotynet.com → web:3010
```

| | Value |
|--|--------|
| Gateway | `127.0.0.1:3021` |
| Internal | Next.js `3010` |
| Dev domain | `dev.spotynet.com` (set in `dev.sh`) |

**Note:** Host port `3010` belongs to **Jay**. Spotynet uses gateway **3021**.

## One-time on this machine

1. **DNS:** Route 53 A record `dev` → EC2 Elastic IP (`dig +short dev.spotynet.com`)
2. **Host nginx:** `sudo ./deploy/apply-nginx.sh`
3. **TLS:** `sudo certbot --nginx -d dev.spotynet.com --redirect`
4. **Start:** `./dev.sh`

## Day-to-day

```bash
./dev.sh
docker compose -f compose.yaml logs -f
docker compose -f compose.yaml down
```

URL: `https://dev.spotynet.com/`

## Production (dedicated machine)

```bash
./deploy.sh                 # defaults: spotynet.com + www.spotynet.com
./deploy.sh example.com www.example.com
./deploy.sh down
```
