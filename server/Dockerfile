FROM oven/bun:latest

WORKDIR /app

# Copy root workspace manifests
COPY bun.lock ./bun.lock
COPY package.json ./package.json

# Copy ONLY server’s workspace manifest
COPY server/package.json ./server/package.json

# Copy the entire repo
COPY . .

# Install deps for server workspace
RUN bun install --cwd ./server

WORKDIR /app/server

EXPOSE 8000

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
