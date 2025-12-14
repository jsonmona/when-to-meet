# Stage 1: Base image
FROM node:24 AS base
WORKDIR /app

# Stage 2: Dependencies and Build
FROM base AS builder
WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY packages/api/package.json ./packages/api/package.json
COPY packages/back/package.json ./packages/back/package.json
COPY packages/front/package.json ./packages/front/package.json
COPY packages/prettier-config/package.json ./packages/prettier-config/package.json

RUN npm install

COPY . .

RUN npm install

# Generate Prisma Client
WORKDIR /app/packages/back
RUN npx prisma generate

# Build frontend
WORKDIR /app/packages/front
RUN npm run build

# Build backend
WORKDIR /app/packages/back
RUN npm run build

# Stage 3: Runner (Production Image)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/packages/back/dist ./dist
COPY --from=builder /app/packages/back/package.json ./package.json
COPY --from=builder /app/packages/back/prisma ./prisma
COPY --from=builder /app/packages/back/prisma.config.ts ./prisma.config.ts

COPY --from=builder /app/packages/front/dist ./public

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/api ./packages/api

EXPOSE 3000

CMD ["node", "dist/app.js"]
