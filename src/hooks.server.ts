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
  return await resolve(event);
};
