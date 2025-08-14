# Multi-stage build for Node.js application
# Using specific Node.js LTS version for consistency
FROM node:18.18.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY .npmrc ./

# Install dependencies
RUN npm ci --only=production && \
    cd frontend && npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app

# Copy package files and source code
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY . .

# Install all dependencies
RUN npm ci && cd frontend && npm ci

# Build backend and frontend
RUN npm run build && npm run build:frontend

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/frontend/build ./frontend/build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy sample OpenAPI specs
COPY --from=builder /app/samples ./samples

# Create directories for logs and uploads
RUN mkdir -p /app/logs /app/uploads && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE 8080 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: 8080, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => process.exit(res.statusCode === 200 ? 0 : 1)); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Start the application
CMD ["node", "dist/index.js"]
