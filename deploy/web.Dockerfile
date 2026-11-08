# GymBuddy web: build the Nuxt static site, then serve it with Caddy (which also proxies /api).
# Build from the repository root: docker build -f deploy/web.Dockerfile .
FROM node:24-alpine AS build
WORKDIR /src
COPY frontend/package.json frontend/package-lock.json ./
# Scripts are skipped here because `nuxt prepare` needs the sources; `nuxt generate` prepares them below.
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY frontend/ ./
RUN npm run generate

FROM caddy:2-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /src/.output/public /srv
