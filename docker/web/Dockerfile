# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Dev image: dependencies only; source is bind-mounted at runtime.
FROM deps AS development

ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3010
CMD ["npx", "next", "dev", "--hostname", "0.0.0.0", "--port", "3010"]

FROM deps AS builder

WORKDIR /app
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:20-bookworm-slim AS production

WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3010 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3010
CMD ["node", "server.js"]
