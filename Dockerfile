FROM node:18-alpine AS build

WORKDIR /app

RUN apk update && apk add git python3 make g++ && rm -rf /var/cache/apk/*

COPY package.json .
RUN npm install
COPY . .
RUN npm run prisma-generate
RUN npm run build

FROM node:18-alpine AS run
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
ENTRYPOINT ["node", "build"]
