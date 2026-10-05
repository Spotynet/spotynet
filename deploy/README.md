# Spotynet landing deploy notes

```bash
./dev.sh
sudo ./deploy/apply-nginx.sh
sudo certbot --nginx -d spotynet.com -d spotynet-dev.spotynet.com --redirect
```

Dedicated prod: `./deploy.sh` (binds `:80` — not for shared EC2).
