import { dev } from '$app/environment';
import { auth } from '$lib/server/lucia';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { actionResult } from 'sveltekit-superforms/server';

import { APIError } from '$lib/errors';
import segfaultHandler from 'node-segfault-handler';

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
    const formType = event.url.searchParams.get('formType');
    // If the action itself threw a redirect, respect that instead of the one in the url
    try {
      // Clone the request so we can read the body while also allowing down stream functions
      // to read as well
      const body = await result.clone().json();
      if (body.type == 'redirect') {
        console.log('redirect found here...', formType);
        if (formType == 'superForm') {
          return actionResult('redirect', body.location, 303);
        } else {
          return new Response('redirect', {
            status: 303,
            headers: { Location: body.location },
          });
        }
      }
    } catch (e: unknown) {}

    // Redirect to the value in the url
    if (result.status == 200) {
      const redirectTo = event.url.searchParams.get('redirectTo');
      if (redirectTo !== null) {
        if (formType == 'superForm') {
          return actionResult('redirect', redirectTo, 303);
        } else {
          return new Response('redirect', {
            status: 303,
            headers: { Location: redirectTo },
          });
        }
      }
    }
  }

  return result;
};

export const handleError: HandleServerError = async ({ error }) => {
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
