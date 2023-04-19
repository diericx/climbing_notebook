import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);

  let response = await resolve(event)

  const { user } = await event.locals.auth.validateUser();
  if (
    event.url.pathname.startsWith("/chart") ||
    event.url.pathname.startsWith("/exerciseEvent") ||
    event.url.pathname.startsWith("/journalEntry") ||
    event.url.pathname.startsWith("/profile") ||
    event.url.pathname.startsWith("/trainingProgram")
  ) {
    if (!user) {
      return new Response(null, {
        status: 302,
        headers: {
          location: '/login?redirectTo=' + event.url
        }
      })
    }
  }

  return response;
};
