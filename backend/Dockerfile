FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
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
USER backend
EXPOSE 3002
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 CMD wget -qO- http://127.0.0.1:3002/api/health || exit 1
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js 2>/dev/null || node dist/src/main.js"]
