import type { Actions } from "./$types";
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { isPasswordValid, isUsernameValid } from "$lib/user";
import { auth } from "$lib/server/lucia";
import { LuciaError } from "lucia-auth";
import { SERVER_ERROR } from "$lib/helperTypes";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) throw redirect(302, '/');
  return {};
};

export const actions: Actions = {
  login: async ({ request, locals, url }) => {
    const form = await request.formData();
    const username = form.get('username');
    const password = form.get('password');

    if (!isUsernameValid(username)) {
      return fail(401, { message: "Username cannot be empty" })
    }
    if (!isPasswordValid(password)) {
      return fail(401, { message: "Password cannot be empty" })
    }

    try {
      const key = await auth.useKey("username", username, password);
      const session = await auth.createSession(key.userId);
      locals.auth.setSession(session);
    } catch (e) {
      // Catch KNOWN duplicate username/provider id errors from both Lucia and the 
      // propogated Prisma erros.
      if (
        e instanceof LuciaError &&
        (e.message === 'AUTH_INVALID_KEY_ID' ||
          e.message === 'AUTH_INVALID_PASSWORD' ||
          e.message === 'AUTH_INVALID_SESSION_ID')
      ) {
        console.error(e.name, e.message);
        return fail(401, { message: "Incorrect username or password" })
      }

      // Print and communicate unknown errors
      console.error(e.name, e.message);
      return fail(401, { message: SERVER_ERROR })
    }

    return {
      success: true
    };
  },

  register: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const username = form.get('username');
    const password = form.get('password');
    const email = form.get('email');

    if (!isUsernameValid(username)) {
      return fail(401, { message: "Username cannot be empty" })
    }
    if (!isPasswordValid(password)) {
      return fail(401, { message: "Password cannot be empty" })
    }

    try {
      const user = await auth.createUser({
        primaryKey: {
          providerId: 'username',
          providerUserId: username,
          password
        },
        attributes: {
          username,
          email
        }
      });
      const session = await auth.createSession(user.userId);
      locals.auth.setSession(session);
    } catch (e) {
      // Catch KNOWN duplicate username/provider id errors from both Lucia and the 
      // propogated Prisma erros.
      if (
        e instanceof LuciaError &&
        (e.message === 'AUTH_INVALID_KEY_ID' ||
          e.message === 'AUTH_INVALID_PASSWORD' ||
          e.message === 'AUTH_INVALID_SESSION_ID')
      ) {
        console.error(e.name, e.message);
        return fail(401, { message: "Incorrect username or password" })
      }

      // Print and communicate unknown errors
      console.error(e.name, e.message);
      return fail(401, { message: SERVER_ERROR })
    }

    return {
      success: true
    };
  }
};
