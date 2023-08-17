// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('$lib/server/lucia.js').Auth;
  type DatabaseUserAttributes = {
    username: string;
  };
  type DatabaseSessionAttributes = {};
}

// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      auth: import('lucia').AuthRequest;
    }
  }
}

export {};
