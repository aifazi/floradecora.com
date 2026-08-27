FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install -g npm@11 && npm config set fetch-retries 5 && npm config set fetch-retry-mintimeout 20000 && npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --audit=false --prefer-offline || (sleep 5 && npm ci --audit=false --prefer-offline)
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 backend
COPY --from=base --chown=backend:nodejs /app/dist ./dist
COPY --from=base --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=backend:nodejs /app/package.json ./package.json
COPY --from=base --chown=backend:nodejs /app/prisma ./prisma
COPY --from=base --chown=backend:nodejs /app/scripts ./scripts
USER backend
EXPOSE 3002
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 CMD wget -qO- http://127.0.0.1:3002/api/health || exit 1
# Explicit start handles both Nest build outputs; check-env enforces secrets in prod
CMD ["sh", "-c", "node scripts/check-env.mjs && npx prisma migrate deploy && node dist/main.js || node dist/src/main.js"]
