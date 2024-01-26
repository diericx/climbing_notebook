Prisma Helpers contain any code that sits alongside the Prisma Type for a resource, but is not concerned with the business logic or data itself. This sepperation is necessary so the client side can import things like select generators without worrying about accidentally touching server code that could cause issues.

It is technically possible for this code to live in the Repos and be imported via `import type`, but the solid sepperation precludes any accidental value imports. If that is done, the error produced is extremely cryptic and very hard to debug.
