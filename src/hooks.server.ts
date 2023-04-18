import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import { handleHooks } from "@lucia-auth/sveltekit";

const logger: Handle = async ({ event, resolve }) => {
  let { user, session } = await event.locals.validateUser();
  event.locals.user = user;
  event.locals.session = session;

  if (
    event.url.pathname.startsWith("/api/chart") ||
    event.url.pathname.startsWith("/api/exerciseEvent") ||
    event.url.pathname.startsWith("/api/journalEntry") ||
    event.url.pathname.startsWith("/api/metric") ||
    event.url.pathname.startsWith("/api/profile") ||
    event.url.pathname.startsWith("/api/trainingProgram") ||
    event.url.pathname.startsWith("/chart") ||
    event.url.pathname.startsWith("/exerciseEvent") ||
    event.url.pathname.startsWith("/journalEntry") ||
    event.url.pathname.startsWith("/profile") ||
    event.url.pathname.startsWith("/trainingProgram")
  ) {
    if (!user || !session || session.state !== 'active') {
      throw redirect(303, '/login?redirectTo=' + event.url.pathname)
    }
  }

  const response = await resolve(event);

  return response;
}
export const handle = sequence(handleHooks(auth), logger);

