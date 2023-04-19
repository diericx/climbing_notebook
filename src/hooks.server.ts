import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import { handleHooks } from "@lucia-auth/sveltekit";

const logger: Handle = async ({ event, resolve }) => {
  let { user, session } = await event.locals.validateUser();
  event.locals.user = user;
  event.locals.session = session;

  // if (
  //   event.url.pathname.startsWith("/chart") ||
  //   event.url.pathname.startsWith("/exerciseEvent") ||
  //   event.url.pathname.startsWith("/journalEntry") ||
  //   event.url.pathname.startsWith("/profile") ||
  //   event.url.pathname.startsWith("/trainingProgram")
  // ) {
  //   if (!session) {
  //     throw redirect(303, '/login?redirectTo=' + event.url.pathname)
  //   }
  // }

  const response = await resolve(event);

  return response;
}
export const handle = sequence(handleHooks(auth), logger);

