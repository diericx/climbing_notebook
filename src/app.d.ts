/// <reference types="lucia" />
declare global {
  declare namespace Lucia {
    type Auth = import('$lib/server/lucia').Auth;
    type DatabaseUserAttributes = {
      username: string;
      email: string;
    };
    type DatabaseSessionAttributes = object;
  }
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      auth: import('lucia').AuthRequest;
    }
    interface Error {
      message: string;
      status?: number;
    }
  }
  interface PageData {
    flash?: { type: 'success' | 'error'; message: string };
  }
}

export {};
