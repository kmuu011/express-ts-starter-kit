FROM node:22.14.0 AS builder

WORKDIR /server

COPY server/*.json ./
RUN npm ci

COPY server/src ./src
COPY server/env ./env

RUN npm run build

FROM node:22.14.0

WORKDIR /server

COPY --from=builder /server/dist ./dist
COPY --from=builder /server/env ./env
COPY --from=builder /server/package*.json ./

RUN npm ci --omit=dev

CMD ["npm", "run", "start:production"]
