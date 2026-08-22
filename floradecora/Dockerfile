FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Skip build if .next already exists (pre-built on host)
RUN if [ ! -d ".next/standalone" ] && [ ! -d ".next/build" ]; then npx next build; else echo "Using pre-built .next"; fi
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
