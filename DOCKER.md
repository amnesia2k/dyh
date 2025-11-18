# Docker Guide for this Project

This project is already set up to run entirely in Docker using a single `docker-compose.yml` file at the repository root. This document explains:

- What each container does
- How to run the stack locally with Docker
- How to configure environment variables
- How to deploy to a remote server (VPS) using the same setup
- How to think about production‑ready tweaks (reverse proxy, HTTPS, non‑dev commands)

---

## 1. Prerequisites

On any machine where you want to run this stack (your laptop or a VPS), you need:

- Docker Engine (Docker Desktop on macOS/Windows, or `docker-ce` on Linux)
- Docker Compose plugin (`docker compose` command)  
  - On newer Docker installs this is included by default; if not, install the Compose plugin.

You do **not** need Node, Bun, Mongo, or Redis installed on the host – everything runs in containers.

---

## 2. Repository Layout (Docker‑related)

Important files for Docker:

- `docker-compose.yml` – Defines all services for the app:
  - `db` – MongoDB
  - `redis` – Redis
  - `api` – Backend (Express/Bun)
  - `web` – Frontend (Vite/Bun)
  - `redis-commander` – Web UI for Redis
  - `mongo-express` – Web UI for MongoDB
- `server/Dockerfile` – Image definition for the backend (`api` service)
- `client/Dockerfile` – Image definition for the frontend (`web` service)
- `server/.env` – Backend environment variables (you create this)
- `client/.env` – Frontend environment variables (you create this)

You work from the project root (same level as `docker-compose.yml`).

---

## 3. Services Overview

### 3.1 MongoDB (`db`)

- Image: `mongo:7`
- Port exposed: `27017` on the host → `27017` in the container
- Data volume:
  - `dyhdb:/data/db` (named Docker volume)
- This holds your application data. The `api` service connects to it via the Docker network name `db`.

### 3.2 Redis (`redis`)

- Image: `redis:7`
- Port exposed: `6379` on host → `6379` in container
- Data volume:
  - `redisdata:/data` (named Docker volume)
- Used for caching, rate limiting, and any in‑app Redis usage.

### 3.3 Backend API (`api`)

Defined under `services.api` in `docker-compose.yml`:

- Build:
  - `context: .`
  - `dockerfile: ./server/Dockerfile`
- Container name: `dyh-api`
- Dependencies: `db`, `redis`
- Port:
  - `8000:8000` (host:container)
- Environment:
  - `env_file: ./server/.env` – base values
  - `DB_URL: mongodb://db/dyhdb` – overrides `DB_URL` from `.env` to point to the `db` service by name
- Volumes:
  - `./server:/app` – mounts your local `server` folder into the container (for live editing in dev)
  - `/app/node_modules` – anonymous volume so your host does not override container `node_modules`
- Command:
  - `bun dev` (starts the backend in dev mode, probably via nodemon or similar)

### 3.4 Frontend Web (`web`)

Defined under `services.web` in `docker-compose.yml`:

- Build:
  - `context: .`
  - `dockerfile: ./client/Dockerfile`
- Container name: `dyh-web`
- Depends on: `api`
- Port:
  - `3000:3000` (host:container) – Vite dev server
- Environment:
  - `env_file: ./client/.env`
  - `IN_DOCKER=1` – can be used inside the app to detect container environment
- Volumes:
  - `./client:/app` – mounts your local `client` folder into the container
  - `/app/node_modules` – anonymous volume for dependencies
- Command:
  - `bun dev` (Vite dev server)

### 3.5 Redis UI (`redis-commander`)

- Image: `rediscommander/redis-commander:latest`
- Port:
  - `8081:8081` – web UI on the host at `http://localhost:8081`
- Connects to internal Redis service with:
  - `REDIS_HOSTS=local:redis:6379`

### 3.6 Mongo UI (`mongo-express`)

- Image: `mongo-express:1.0.2-20-alpine3.19`
- Port:
  - `8082:8081` – host `8082` mapped to container `8081`
- Connects to the `db` service via environment variables:
  - `ME_CONFIG_MONGODB_SERVER: db`
  - Auth and basic auth credentials configured via environment variables.

---

## 4. Dockerfiles (How Images Are Built)

### 4.1 Backend: `server/Dockerfile`

Key points:

- Base image: `oven/bun:latest`
- `WORKDIR /app`
- Copies root manifests:
  - `bun.lock`
  - `package.json`
- Copies the server workspace manifest:
  - `server/package.json`
- Copies the entire repo:
  - `COPY . .`
- Installs dependencies for the server workspace:
  - `RUN bun install --cwd ./server`
- Sets working directory:
  - `WORKDIR /app/server`
- Exposes port `8000`
- Default command:
  - `CMD ["bun", "dev"]`

This is optimized for **development** (hot reload, watchers, etc.).

### 4.2 Frontend: `client/Dockerfile`

Key points:

- Base image: `oven/bun:latest`
- `WORKDIR /app`
- Copies root manifests:
  - `bun.lock`
  - `package.json`
- Copies client workspace manifest:
  - `client/package.json`
- Copies the entire repo:
  - `COPY . .`
- Installs dependencies for the client workspace:
  - `RUN bun install --cwd ./client`
- Sets working directory:
  - `WORKDIR /app/client`
- Exposes port `3000`
- Default command:
  - `CMD ["bun", "dev"]`

Again, tuned for **development** (Vite dev server).

> Note: For production you may want to switch to “build then serve static” instead of running `bun dev`. See the production notes below.

---

## 5. Environment Variables

You configure environment variables using `.env` files that are **not** committed to git:

- Backend: `server/.env`
- Frontend: `client/.env`

These are referenced in `docker-compose.yml` via `env_file`.

### 5.1 Backend `.env` (`server/.env`)

Typical values you might have:

```env
PORT=8000
DB_URL=mongodb://localhost/dyhdb
JWT_SECRET=super-secret-key
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TLS=false
```

In Docker, `DB_URL` is overridden in `docker-compose.yml` to `mongodb://db/dyhdb`, so the API talks to the `db` service by name.

### 5.2 Frontend `.env` (`client/.env`)

For a Vite/Bun frontend you might have:

```env
VITE_API_URL=http://localhost:8000
VITE_SOME_PUBLIC_KEY=...
IN_DOCKER=1
```

When deploying to a remote server, you’ll usually change `VITE_API_URL` to point to the production URL (e.g. `https://api.yourdomain.com` or `https://yourdomain.com/api` depending on your setup).

---

## 6. Running the Stack Locally with Docker

This is the starting point: run everything on your machine using Docker instead of installing Mongo/Redis manually.

### 6.1 Create `.env` Files (If You Haven’t)

- Create `server/.env` with your backend config.
- Create `client/.env` with your frontend config.

Do **not** commit these files if they contain secrets.

### 6.2 Start the Stack

From the project root:

```bash
docker compose up --build
```

or, if your Docker version uses the old syntax:

```bash
docker-compose up --build
```

This will:

- Build the backend and frontend images using `server/Dockerfile` and `client/Dockerfile`
- Start MongoDB, Redis, API, web, Redis Commander, and Mongo Express

You will see logs for all services in your terminal.

### 6.3 Access the Services

Once the containers are up:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Redis UI: `http://localhost:8081`
- Mongo UI: `http://localhost:8082`

Logs: you can see logs for all services with:

```bash
docker compose logs -f
```

(Use `docker compose logs -f api` to watch only the API logs, etc.)

### 6.4 Run in Background (Detached Mode)

To run the stack in the background:

```bash
docker compose up -d --build
```

To stop everything:

```bash
docker compose down
```

The named volumes `dyhdb` and `redisdata` persist your data between runs.

---

## 7. Production‑Style Deployment on a VPS

The easiest mental model for deployment is: **“do the same thing on a remote server that you do locally”**.

### 7.1 Setup on the VPS

On your VPS (e.g. Ubuntu):

1. Install Docker and Docker Compose plugin:
   - Follow Docker’s official instructions for your OS.
2. Clone this repository onto the server:
   ```bash
   git clone <your-repo-url>
   cd dyh
   ```
3. Create production `.env` files on the server:
   - `server/.env` – production DB URL, JWT secrets, etc.
   - `client/.env` – production API URL and any other envs.

   Do **not** use your local `.env` files if they contain dev‑only values.

### 7.2 Run the Stack on the VPS

From the repo root on the server:

```bash
docker compose up -d --build
```

This builds the images and starts all services in the background.

You can then:

- Hit `http://<server-ip>:3000` to reach the frontend
- Hit `http://<server-ip>:8000` to reach the backend directly

> For a real production setup, you usually won’t expose 3000 and 8000 directly to the internet; instead, you put a reverse proxy in front (see below).

### 7.3 Updating the App

When you push new code:

1. SSH into the VPS.
2. `cd` into the repo.
3. Pull latest changes:
   ```bash
   git pull
   ```
4. Rebuild and restart:
   ```bash
   docker compose up -d --build
   ```

Docker will rebuild images only if files changed and restart containers.

---

## 8. Reverse Proxy and HTTPS (Recommended for Production)

For a proper production deployment you usually:

- Run a reverse proxy (e.g. Caddy, Nginx, Traefik) in **another Docker container**.
- Bind ports `80` and `443` on the VPS to that proxy container.
- Configure the proxy to:
  - Terminate HTTPS (handle Let’s Encrypt certificates)
  - Forward incoming requests to the `web` container on port `3000` (and potentially to `api:8000` if exposed separately).

### 8.1 Example High‑Level Architecture

- Client → `https://yourdomain.com` → Reverse proxy container → `web:3000`
- Reverse proxy → internal network → `api:8000` (if needed, e.g. `/api` route)
- Mongo and Redis remain inside the Docker network, not exposed directly to the internet.

### 8.2 Where to Configure This

You can:

- Add a new `proxy` service to `docker-compose.yml` (for Caddy/Nginx/Traefik).
- Mount a config file from the host into the `proxy` container.

Because reverse proxy choice is personal and environment‑specific, this repo doesn’t hardcode one, but the pattern is:

```yaml
proxy:
  image: caddy:latest  # or nginx/traefik
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./Caddyfile:/etc/caddy/Caddyfile  # example
  depends_on:
    - web
    - api
```

Then the proxy config routes requests to `web:3000` and/or `api:8000` on the internal Docker network.

---

## 9. Dev vs Production Commands

Currently both Dockerfiles use `bun dev`, which is great for development but not ideal for production:

- Dev servers often:
  - Use more memory
  - May have slower performance
  - Are not designed for long‑running, high‑traffic production workloads

### 9.1 Production‑Style Backend (Conceptual)

Typical production flow:

1. Build:
   ```dockerfile
   RUN bun install --cwd ./server
   RUN bun run build --cwd ./server
   ```
2. Run:
   ```dockerfile
   CMD ["bun", "run", "start"]  # or the compiled output
   ```

And update `docker-compose.yml` to use the new command instead of `bun dev`.

### 9.2 Production‑Style Frontend (Conceptual)

Typical production frontend flow:

1. Build static assets:
   ```dockerfile
   RUN bun install --cwd ./client
   RUN bun run build --cwd ./client
   ```
2. Serve assets via:
   - A lightweight static server in the same container (e.g. `bun run preview` or `serve`), or
   - A separate Nginx container that serves the built files.

This repo is currently optimized for a smooth **Docker‑based dev environment**. When you’re ready to harden for production, you can evolve the Dockerfiles and `docker-compose.yml` following the concepts above.

---

## 10. Common Commands Reference

From the project root:

- Build and start in foreground:
  ```bash
  docker compose up --build
  ```
- Build and start in background:
  ```bash
  docker compose up -d --build
  ```
- Stop and remove containers:
  ```bash
  docker compose down
  ```
- View logs for all services:
  ```bash
  docker compose logs -f
  ```
- View logs for a single service (e.g. backend `api`):
  ```bash
  docker compose logs -f api
  ```
- List running containers:
  ```bash
  docker ps
  ```

With this in place, you can treat Docker as the standard way to run the entire stack locally and on any server that supports Docker, keeping the environment consistent across machines.

