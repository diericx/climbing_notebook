import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

import segfaultHandler from 'node-segfault-handler';
import { getSessionOrRedirect } from '$lib/utils';

if (!dev) {
  segfaultHandler.registerHandler();
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  const session = await event.locals.auth.validate();

  // TODO: remove all this logic as it will be in the actions and loads
  if (
    event.url.pathname.startsWith('/chart') ||
    event.url.pathname.startsWith('/exerciseEvent') ||
    event.url.pathname.startsWith('/journalEntry') ||
    event.url.pathname.startsWith('/profile') ||
    event.url.pathname.startsWith('/query') ||
    event.url.pathname.startsWith('/dashboard') ||
    event.url.pathname.startsWith('/project') ||
    event.url.pathname.startsWith('/exercise') ||
    event.url.pathname.startsWith('/widget')
    // trainingProgram is handled at the path level
  ) {
    await getSessionOrRedirect({ locals: event.locals, url: event.url });
  }

  const response = await resolve(event);
  return response;
};
