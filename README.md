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

### Production

Apply migration to prod
```
DATABASE_URL= npx prisma migrate deploy
```
