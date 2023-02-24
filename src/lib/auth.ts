import type { RequestHandler } from "./$types";
import { error, redirect } from "@sveltejs/kit";

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

export const protectedPage = (next) => {
  return async function(props) {
    let { locals, url } = props;
    // Protected page
    const session = await locals.validate();
    if (!session) {
      throw redirect(302, `/login?redirectTo=${url.pathname}`)
    }

    return await next({ ...props, session })
  }
}

