import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isPasswordValid, isUsernameValid } from '$lib/user';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia-auth';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) throw redirect(302, '/');
  return {};
};

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const form = await request.formData();
    const username = form.get('username')?.toString();
    const password = form.get('password')?.toString();

    if (!username || !isUsernameValid(username)) {
      return fail(401, { message: 'Username cannot be empty' })
    }
    if (!password || !isPasswordValid(password)) {
      return fail(401, { message: 'Password cannot be empty' })
    }

    try {
      const key = await auth.useKey('username', username, password);
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
        return fail(401, { message: 'Incorrect username or password', username })
      }

      // Print and communicate unknown errors
      console.error(e.name, e.message);
      return fail(401, { message: SERVER_ERROR })
    }

    return {
      success: true
    };
  },

  register: async ({ request, locals }) => {
    const form = await request.formData();
    const username = form.get('username')?.toString();
    const password = form.get('password')?.toString();
    const email = form.get('email');

    if (!username || !isUsernameValid(username)) {
      return fail(401, { message: 'Username cannot be empty' })
    }
    if (!password || !isPasswordValid(password)) {
      return fail(401, { message: 'Password cannot be empty' })
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
      await prisma.profile.create({
        data: {
          goals: '',
          ownerId: user?.userId,
          createdAt: new Date(),
        },
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
        return fail(401, { message: 'Incorrect username or password' })
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
