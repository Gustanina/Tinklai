# Multi-stage build for better optimization
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code and config files
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Build the application
RUN npm run build

# Verify build output
RUN ls -la dist/ && find dist -name "main.js"

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Verify main.js exists (check both possible locations)
RUN (test -f dist/main.js || test -f dist/src/main.js) || (echo "ERROR: main.js not found!" && ls -la dist/ && exit 1)

# Expose port
EXPOSE 3000

# Start the application (try dist/main.js first, then dist/src/main.js)
CMD ["sh", "-c", "if [ -f dist/main.js ]; then node dist/main.js; else node dist/src/main.js; fi"]
