FROM oven/bun:latest

WORKDIR /app

# Copy root workspace manifests
COPY bun.lock ./bun.lock
COPY package.json ./package.json

# Copy ONLY client’s workspace manifest
COPY client/package.json ./client/package.json

# Copy the entire repo (to access client code)
COPY . .

# Install deps for the client workspace
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

# EXPOSE 3000

# CMD ["bun", "dev"]
