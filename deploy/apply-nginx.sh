#!/usr/bin/env bash
# Ensure host nginx routes dev.spotynet.com → 127.0.0.1:3021.
# Inserts a block if missing; otherwise updates proxy_pass.
# Usage: sudo ./deploy/apply-nginx.sh
set -euo pipefail

CONF=/etc/nginx/sites-available/spotynet-dev.conf
BAK="${CONF}.bak.$(date +%F-%H%M%S)"
GATEWAY=3021
HOST=dev.spotynet.com

if [[ $EUID -ne 0 ]]; then
  echo "Run with sudo: sudo $0" >&2
  exit 1
fi

cp -a "$CONF" "$BAK"
echo "Backup: $BAK"

python3 - "$CONF" "$GATEWAY" "$HOST" <<'PY'
import re
import sys

path, gateway, host = sys.argv[1], sys.argv[2], sys.argv[3]
text = open(path, encoding="utf-8").read()

pattern = re.compile(
    rf"(server_name\s+{re.escape(host)}\s*;.*?proxy_pass\s+http://127\.0\.0\.1:)\d+(\s*;)",
    re.DOTALL,
)
text2, n = pattern.subn(rf"\g<1>{gateway}\2", text, count=1)

if n == 1:
    text = text2
    print(f"Updated {host} proxy_pass → 127.0.0.1:{gateway}")
else:
    block = f"""
# =========================
# SPOTYNET LANDING (dev)
# =========================

server {{
    include /etc/nginx/snippets/dev-ip-allow.conf;

    server_name {host};

    location / {{
        proxy_pass http://127.0.0.1:{gateway};
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }}

    listen 80;
    listen [::]:80;
}}

"""
    marker = "if ($host ="
    idx = text.find(marker)
    if idx < 0:
        text = text.rstrip() + "\n" + block
        print(f"Appended {host} block at end of file")
    else:
        start = text.rfind("server {", 0, idx)
        if start < 0:
            start = idx
        text = text[:start] + block.lstrip("\n") + "\n" + text[start:]
        print(f"Inserted {host} block before Certbot HTTP redirects")

open(path, "w", encoding="utf-8").write(text)
PY

nginx -t
systemctl reload nginx
echo "nginx reloaded OK"

SETUP=/home/spotynet/projects/apps/setup.txt
if [[ -f "$SETUP" ]]; then
  echo "==> Ensuring setup.txt has SPOTYNET LANDING section"
  cp -a "$SETUP" "${SETUP}.bak.$(date +%F-%H%M%S)"
  python3 - "$SETUP" <<'PY'
from pathlib import Path
import re
import sys
path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
section = """SPOTYNET LANDING (Docker Compose — per-project nginx)
- Start: cd /home/spotynet/projects/apps/spotynet && ./dev.sh
- Project nginx gateway: 127.0.0.1:3021
- Next.js (internal): 3010
- Domain: dev.spotynet.com → gateway 3021
- Apply host nginx: sudo ./deploy/apply-nginx.sh
- TLS (once): sudo certbot --nginx -d dev.spotynet.com --redirect
- DNS: Route 53 A record dev → EC2 Elastic IP

"""
if "SPOTYNET LANDING" in text:
    text2, n = re.subn(
        r"SPOTYNET LANDING \(Docker Compose — per-project nginx\)\n(?:- .+\n)+",
        section,
        text,
        count=1,
    )
    if n:
        path.write_text(text2, encoding="utf-8")
        print("Updated SPOTYNET LANDING in setup.txt")
    else:
        print("SPOTYNET LANDING present but pattern unmatched — left as-is")
else:
    needle = "JAY (Docker Compose"
    idx = text.find(needle)
    if idx >= 0:
        end = text.find("\n\n", idx)
        if end < 0:
            end = len(text)
        else:
            end += 1
        text = text[:end] + "\n" + section + text[end:]
    else:
        text = section + text
    path.write_text(text, encoding="utf-8")
    print("Inserted SPOTYNET LANDING into setup.txt")
PY
fi

echo
echo "Verify:"
echo "  curl -I -H 'Host: dev.spotynet.com' http://127.0.0.1:3021/"
echo "  curl -I -H 'Host: dev.spotynet.com' http://127.0.0.1/"
echo
echo "DNS must resolve: dig +short dev.spotynet.com   # → this EC2 EIP"
echo "TLS once: sudo certbot --nginx -d dev.spotynet.com --redirect"
