# Stage 1: Build
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Stage 2: Production
FROM node:18-slim

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser -s /sbin/nologin -c "Docker image user" appuser

WORKDIR /app

# Copy production dependencies and application code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Set ownership to the non-root user
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

EXPOSE 3000

CMD ["node", "index.js"]
