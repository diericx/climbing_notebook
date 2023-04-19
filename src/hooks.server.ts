import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);

  const { user } = await event.locals.auth.validateUser();
  if (
    event.url.pathname.startsWith("/chart") ||
    event.url.pathname.startsWith("/exerciseEvent") ||
    event.url.pathname.startsWith("/journalEntry") ||
    event.url.pathname.startsWith("/profile") ||
    event.url.pathname.startsWith("/trainingProgram")
  ) {
    if (!user) {
      throw redirect(303, '/login?redirectTo=' + event.url.pathname)
    }
  }

  return await resolve(event);
};
