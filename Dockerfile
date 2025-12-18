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

# Verify main.js exists
RUN test -f dist/src/main.js || (echo "ERROR: dist/src/main.js not found!" && ls -la dist/ && exit 1)

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]
