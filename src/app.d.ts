// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Session, User } from "lucia-auth";

/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import("$lib/server/lucia").Auth;
  type UserAttributes = {};
}

/// <reference types="@sveltejs/kit" />
declare global {
  declare namespace App {
    interface Locals {
      validate: import("@lucia-auth/sveltekit").Validate;
      validateUser: import("@lucia-auth/sveltekit").ValidateUser;
      setSession: import("@lucia-auth/sveltekit").SetSession;
      user: User | null;
      session: Session | null;
    }
  }

}

export { };
