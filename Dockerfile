# Multi-stage Dockerfile for PAZ ORTEGA IA Diagnostic App

# Stage 1: Build Frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --only=production

# Copy server and built static frontend
COPY server.js ./
COPY --from=build /app/dist ./dist

# Create persistent data directory
RUN mkdir -p ./data

EXPOSE 8080

CMD ["node", "server.js"]
