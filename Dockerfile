FROM node:18-alpine AS build
ENV NODE_ENV=production

WORKDIR /app

RUN apk update && apk add git python3 make g++ && rm -rf /var/cache/apk/*

COPY package.json package-lock.json .
RUN npm ci --omit=dev

COPY . .
RUN npm run prisma-generate
RUN npm run build

FROM node:18-alpine AS run
ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
ENTRYPOINT ["node", "build"]
