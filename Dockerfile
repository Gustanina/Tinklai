# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code and config files
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

# Build the application
RUN npm run build

# Verify build output exists
RUN ls -la dist/ || (echo "Build failed - dist directory not found" && exit 1)
RUN test -f dist/main.js || (echo "Build failed - dist/main.js not found" && exit 1)

# Production stage
FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Verify files are copied
RUN ls -la dist/ || (echo "Copy failed - dist directory not found" && exit 1)
RUN test -f dist/main.js || (echo "Copy failed - dist/main.js not found" && exit 1)

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000), (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main.js"]

