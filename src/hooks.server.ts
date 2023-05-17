import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';
import SegfaultHandler from 'segfault-handler';

SegfaultHandler.registerHandler('crash.log');

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);

  const { user } = await event.locals.auth.validateUser();
  if (
    event.url.pathname.startsWith('/chart') ||
    event.url.pathname.startsWith('/exerciseEvent') ||
    event.url.pathname.startsWith('/journalEntry') ||
    event.url.pathname.startsWith('/profile') ||
    event.url.pathname.startsWith('/trainingProgram') ||
    event.url.pathname.startsWith('/query') ||
    event.url.pathname.startsWith('/dashboard')
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

  const response = await resolve(event)
  return response;
};
