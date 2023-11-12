FROM node:18-bullseye-slim AS builder
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:18-bullseye-slim
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json ./
EXPOSE 3000
ENV NODE_ENV=production
ENV TZ=Asia/Bangkok
CMD [ "node", "build" ]