import { auth } from '$lib/server/lucia';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { dev } from '$app/environment';

import segfaultHandler from 'node-segfault-handler';
import { APIError, throwAPIErrorAsHttpError } from '$lib/errors';

if (!dev) {
  segfaultHandler.registerHandler();
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);

  const isFormAction =
    event.request.headers.get('x-sveltekit-action') ||
    event.request.headers.get('content-type') === 'application/x-www-form-urlencoded';

  return await resolve(event);
  // return await resolve(event);
};

export const handleError: HandleServerError = async ({ event, error }) => {
  // Effectively make APIError a known error
  if (error instanceof APIError) {
    let status = 401;
    if (error.message === 'INVALID_PERMISSIONS') {
      status = 403;
    }
    if (error.message === 'NOT_FOUND') {
      status = 404;
    }
    return {
      status,
      message: error.detail,
    };
  }

  console.error(error);
  return {
    status: 500,
    message: 'Internal server error',
  };
};
