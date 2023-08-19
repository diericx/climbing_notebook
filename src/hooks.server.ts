import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

import segfaultHandler from 'node-segfault-handler';

if (!dev) {
  segfaultHandler.registerHandler();
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  return await resolve(event);
};
