# FROM oven/bun:latest

# WORKDIR /app

# # Copy only root + client manifests first
# COPY package.json bun.lock ./
# COPY client/package.json ./client/

# # Install ONLY client workspace dependencies (cached)
# RUN bun install --cwd ./client

# # Copy client source AFTER deps
# COPY client ./client

# WORKDIR /app/client

# EXPOSE 8000
# CMD ["bun", "dev"]

FROM oven/bun:latest

WORKDIR /app

# Copy root workspace manifests
COPY bun.lock ./bun.lock
COPY package.json ./package.json

# Copy ONLY client’s workspace manifest
COPY client/package.json ./client/package.json

# Copy the entire repo
COPY . .

# Install deps for client workspace
RUN bun install --cwd ./client

WORKDIR /app/client

EXPOSE 3000

CMD ["bun", "dev"]

# FROM oven/bun:latest

# WORKDIR /app

# # Install dependencies with Bun
# COPY package.json bun.lockb ./
# RUN bun install

# # Copy the rest of the application
# COPY . .

# EXPOSE 8000

# CMD ["bun", "dev"]
