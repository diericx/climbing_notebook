# Climbing Notebook

## Prisma

### Development

Pushing a new schema for testing
```
npx prisma generate
npx prisma db push
```

Generate a new migration
```
npx prisma migrate dev --name <name>
```

Connect to local psql server
```
psql cndb_development
```

### Production

Apply migration to prod
```
DATABASE_URL= npx prisma migrate deploy
```

## Docker Swarm

Below are the dependencies and requirements for running in Docker Swarm
as well as some tooling for handling it in production.

### Secrets

- `cn_staging_db_url`
  - A postgres url pointing to the staging db
-  `cn_prod_db_url`
  - A postgres url pointing to the production db

### Networks

- `traefik`
- `postgres`

### Running Migrations

```
docker run \
  --entrypoint npx \
  -e DATABASE_URL=<url> \
  climbingnotebook:master \
  prisma migrate deploy
```
