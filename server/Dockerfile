ARG PNPM_VERSION=10.13.1

FROM node:24-alpine

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 8000

CMD ["pnpm", "dev"]