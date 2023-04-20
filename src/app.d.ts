// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import('$lib/server/lucia.js').Auth;
  type UserAttributes = {
    username: string;
  };
}

// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      auth: import('lucia-auth').AuthRequest;
    }
  }
}

export { };
