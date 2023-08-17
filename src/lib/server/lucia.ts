// lib/server/lucia.ts
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { PrismaClient } from '@prisma/client';
import { prisma } from '$lib/prisma';

export const auth = lucia({
  adapter: prismaAdapter(prisma),
  env: dev ? 'DEV' : 'PROD',
  transformDatabaseUser: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
      email: userData.email,
    };
  },
  middleware: sveltekit(),
  experimental: {
    debugMode: true,
  },
});

export type Auth = typeof auth;
