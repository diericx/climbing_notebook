import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loginSchema, signupSchema } from '$lib/user';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { superValidate } from 'sveltekit-superforms/server';
import { Prisma } from '@prisma/client';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) throw redirect(302, '/');
  return {};
};

export const actions: Actions = {
  login: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, loginSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const key = await auth.useKey('username', form.data.username, form.data.password);
      const session = await auth.createSession({ userId: key.userId, attributes: {} });
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
        form.message = 'Incorrect username or password';
        return fail(401, { form });
      }

      // Print and communicate unknown errors
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }
    return {
      form,
    };
  },

  register: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, signupSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const user = await auth.createUser({
        key: {
          providerId: 'username',
          providerUserId: form.data.username,
          password: form.data.password,
        },
        attributes: {
          username: form.data.username,
          email: form.data.email,
        },
      });
      await prisma.profile.create({
        data: {
          goals: '',
          ownerId: user?.userId,
          createdAt: new Date(),
        },
      });

      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
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
        form.message = 'Incorrect username or password';
        return fail(401, { form });
      }

      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code == 'P2002') {
        form.message = 'Username or email are already taken';
        return fail(401, { form });
      }
      // Print and communicate unknown errors
      console.error(e.name, e.message);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }
    return {
      form,
    };
  },
};
