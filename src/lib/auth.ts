import type { RequestHandler } from "./$types";
import { error } from "@sveltejs/kit";

export const protectedEndpoint = (next) => {
  return async function(context) {
    // Validate session
    let { user, session } = await context.locals.validateUser();
    if (!session || session.state !== 'active') {
      throw error(403, { message: "unauthorized" });
    }

    // Propogate auth values
    context.locals.session = session;
    context.locals.user = user;

    return await next(context)
  } satisfies RequestHandler;
}

