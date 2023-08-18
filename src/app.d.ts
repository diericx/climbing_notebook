/// <reference types="lucia" />
declare global {
  declare namespace Lucia {
    type Auth = import('$lib/server/lucia').Auth;
    type DatabaseUserAttributes = {
      username: string;
    };
    type DatabaseSessionAttributes = {};
  }
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      auth: import('lucia').AuthRequest;
    }
  }
}

export {};
