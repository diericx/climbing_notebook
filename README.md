# Climbing Notebook

## Development

### Setting Up Environment

#### Node

Install packages

```sh
npm install
```

#### Postgres

After your local postgres server is running, create the database

```psql
CREATE ROLE climbingnotebook;
CREATE DATABASE cndb_development WITH OWNER=climbingnotebook;
```

Sync local database

```sh
npx prisma db push
```

#### AWS

There are some features that require AWS access keys, namely ECS and S3 for password reset emails and image storage.

## Running locally

Run the node server locally
```
npm run dev
```

## Dev Operations

Pushing a new schema for testing which will also regenerate Prisma but will NOT generate a migration.

```
npx prisma db push
```

Generate a new migration

```
npx prisma migrate dev --name <name>
```

### Dev Notes

#### ZOD Schemas
- nullish values must be set in the forms or they will be parsed as null and thus unset
  in the database.

### Production

#### Docker Swarm

Below are the dependencies and requirements for running in Docker Swarm
as well as some tooling for handling it in production.

#### Required Secrets

- `cn_staging_db_url`
  - A postgres url pointing to the staging db
-  `cn_prod_db_url`
  - A postgres url pointing to the production db

#### Required Networks

- `traefik`
- `postgres`

#### Running Migrations

Apply migration

```
docker run \
  --entrypoint npx \
  -e DATABASE_URL=<url> \
  climbingnotebook:master \
  prisma migrate deploy
```

