# Use an ARG for easy pinning of pnpm version
ARG PNPM_VERSION=10.13.1

# Base image
FROM node:24-alpine

# Install pnpm globally (with caching for npm downloads)
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

# Set working directory
WORKDIR /app

# Copy only dependency files first (to leverage Docker cache)
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm, caching the pnpm store
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install

# Copy rest of the source code
COPY . .

# Expose the application port
EXPOSE 8000

# Default command
CMD ["pnpm", "dev"]
