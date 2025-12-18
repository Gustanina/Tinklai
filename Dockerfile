# Use Node.js 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code and config files
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Build the application and verify dist exists
RUN npm run build && ls -la dist/src/ && ls -la dist/src/main.js || (echo "Build failed - dist/src/main.js not found" && exit 1)

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

# Verify dist exists before starting
RUN test -f dist/src/main.js || (echo "ERROR: dist/src/main.js not found!" && exit 1)

# Start the application
CMD ["node", "dist/src/main.js"]

