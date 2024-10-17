import { SERVER_ERROR } from '$lib/helperTypes';
import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { loginSchema, signupSchema } from '$lib/zodSchemas';
import { Prisma } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) redirect(302, '/');
  return {};
};

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(loginSchema), {
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
      return fail(500, { message: SERVER_ERROR });
    }

    return {
      form,
    };
  },

  register: async ({ request, locals }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(signupSchema), {
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
    } catch (e: any) {
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
      return fail(500, { message: SERVER_ERROR });
    }

    return {
      form,
    };
  },
};
