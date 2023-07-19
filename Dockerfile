FROM node:18 AS build

WORKDIR /app

COPY package*.json .

# Deps for segfault package, leave these until we find out what is causing the issue
RUN apt install --no-cache python3 cmake make g++ git bash zip curl-dev zlib-dev elfutils-dev 

RUN npm ci

COPY . .
RUN npm run prisma-generate
RUN npm run build
RUN npm prune --production

FROM node:18 AS run

# Deps for segfault package, leave these until we find out what is causing the issue
RUN apt install --no-cache python3 cmake make g++ git bash zip curl-dev zlib-dev elfutils-dev 

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src/scripts ./scripts
COPY --from=build /app/prisma ./prisma
RUN ulimit -c unlimited
ENTRYPOINT ["node", "build"]
