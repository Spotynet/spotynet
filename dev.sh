#!/bin/bash

echo "🚀 Starting SPOTYNET DEV"

APP_NAME="spotynet-dev"
PORT=3010

cd "$(dirname "$0")"

# -------------------------
# 🧹 Clean old process
# -------------------------
echo "🧹 Cleaning old PM2 process..."
pm2 delete $APP_NAME 2>/dev/null

# -------------------------
# 🌐 Start Next.js
# -------------------------
echo "🌐 Starting Next.js ($APP_NAME) on port $PORT..."
pm2 start npm \
  --name $APP_NAME \
  -- run dev -- --hostname 0.0.0.0 --port $PORT

# -------------------------
# 💾 Save PM2 state
# -------------------------
pm2 save

# -------------------------
# 📊 Status
# -------------------------
echo "✅ SPOTYNET DEV running:"
pm2 list
echo ""
echo "  spotynet-dev -> https://spotynet.com              (localhost:$PORT)"
echo "                 https://spotynet-dev.spotynet.com  (localhost:$PORT)"
