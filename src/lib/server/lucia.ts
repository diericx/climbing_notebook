// lib/server/lucia.ts
import lucia from "lucia-auth";
import luciaPrismaAdapter from "@lucia-auth/adapter-prisma";
import { dev } from "$app/environment";
import { prisma } from "$lib/prisma";

export const auth = lucia({
  adapter: luciaPrismaAdapter(prisma),
  env: dev ? "DEV" : "PROD",
  transformUserData: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
      email: userData.email,
    };
  }
});

export type Auth = typeof auth;
