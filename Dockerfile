FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy app (must include prisma/ before prisma generate)
COPY . .

# Generate Prisma client (schema is in prisma/schema.prisma).
# prisma.config.ts requires DATABASE_URL; use a dummy value at build time (generate does not connect).
# At runtime, docker-compose sets DATABASE_URL so the app connects to the db service.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public"
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 3000

# Run migrations then start (migrations run again at runtime via compose command)
CMD ["npm", "run", "start"]
