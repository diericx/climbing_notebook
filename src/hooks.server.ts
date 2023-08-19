import { auth } from '$lib/server/lucia';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { actionResult } from 'sveltekit-superforms/server';

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

  const result = await resolve(event);

  // For form actions only, if there is a redirectTo search param, on success redirect
  // to that location
  if (isFormAction) {
    // If the action itself threw a redirect, respect that instead of the one in the url
    try {
      const body = await result.json();
      if (body.type == 'redirect') {
        return actionResult('redirect', body.location, 303);
      }
    } catch (e: any) {}

    // Redirect to the value in the url
    if (result.status == 200) {
      const redirectTo = event.url.searchParams.get('redirectTo');
      if (redirectTo !== null) {
        return actionResult('redirect', redirectTo, 303);
      }
    }
  }

  return result;
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
