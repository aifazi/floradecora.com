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
# Ensure static files are at the correct path for standalone server
RUN if [ -d ".next/static" ] && [ ! -d ".next/standalone/.next/static" ]; then cp -r .next/static .next/standalone/.next/static; fi
RUN if [ -d "public" ] && [ ! -d ".next/standalone/public" ]; then cp -r public .next/standalone/public; fi
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
