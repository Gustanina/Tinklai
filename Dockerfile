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

# Build the application
RUN npm run build || (echo "Build command failed!" && exit 1)

# Verify build output
RUN ls -la dist/ || (echo "dist/ directory not found!" && exit 1)
RUN find dist -name "main.js" || (echo "main.js not found in dist!" && exit 1)
RUN test -f dist/src/main.js || (echo "ERROR: dist/src/main.js not found! Contents of dist:" && ls -la dist/ && exit 1)

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

# Verify dist exists before starting
RUN test -f dist/src/main.js || (echo "ERROR: dist/src/main.js not found!" && exit 1)

# Start the application
CMD ["node", "dist/src/main.js"]

