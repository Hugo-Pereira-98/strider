# syntax=docker/dockerfile:1.4
# Inspired by https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:18-alpine AS base

# Install deps
FROM base AS deps
WORKDIR /app

COPY --link package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app

COPY --from=deps --link /app/node_modules ./node_modules
COPY --link  . .

# Set build time vars to be bundled in the app
ARG API_URL
ENV NEXT_PUBLIC_APP_API_URL=$API_URL
ARG APP_URL
ENV NEXT_PUBLIC_APP_URL=$APP_URL

# Print env vars in intermediate build container
RUN env | grep NEXT_

RUN npm install -g npm
RUN npm run build

FROM base AS runner

ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --link /app/public ./public

# Creating a standalone app
#  https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
COPY --from=builder --link --chown=1001:1001 /app/.next/standalone /app/
COPY --from=builder --link --chown=1001:1001 /app/.next/static /app/.next/static

USER nextjs

CMD ["node", "server.js"]
