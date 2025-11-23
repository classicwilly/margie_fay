### Multi-stage Dockerfile for production build and Node runtime (serves SPA and API)
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
# Copy production-ready files
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
