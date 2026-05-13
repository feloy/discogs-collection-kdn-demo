# Dockerfile for SvelteKit Discogs Collection Viewer

# Use the specified Node.js runtime as a parent image
FROM quay.io/hummingbird/nodejs:20 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM quay.io/hummingbird/nodejs:20 AS runner

WORKDIR /app

# Copy package.json and install only production dependencies
COPY --from=builder /app/package*.json ./

# Install only production dependencies for runtime
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "build/index.js"]