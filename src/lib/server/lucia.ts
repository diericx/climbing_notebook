// lib/server/lucia.ts
import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';
import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
  adapter: prismaAdapter(prisma, {
    user: 'authUser',
    key: 'authKey',
    session: 'authSession',
  }),
  env: dev ? 'DEV' : 'PROD',
  middleware: sveltekit(),

  getUserAttributes: (data) => {
    return {
      // userId included by default
      username: data.username,
      email: data.email,
    };
  },

  experimental: {
    debugMode: true,
  },
});

export type Auth = typeof auth;
