import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { resetPasswordSchema } from '$lib/user';
import { message, superValidate } from 'sveltekit-superforms/server';
import { PasswordResetRepo } from '$lib/passwordReset';
import { prisma } from '$lib/prisma';
import { auth } from '$lib/server/lucia';
import { SERVER_ERROR } from '$lib/helperTypes';

export const load: PageServerLoad = async ({ locals, url }) => {
  const token = url.searchParams.get('token');
  if (token == undefined) {
    throw error(403, 'Invalid token');
  }

  const passwordResetRepo = new PasswordResetRepo(prisma);
  const { isValid } = await passwordResetRepo.canResetPassword(token);
  if (!isValid) {
    throw error(403, 'Invalid token');
  }

  return { token }
};

export const actions: Actions = {
  resetPassword: async ({ request, url }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, resetPasswordSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const passwordResetRepo = new PasswordResetRepo(prisma);
    const { isValid, token } = await passwordResetRepo.canResetPassword(form.data.token);
    if (!isValid) {
      return message(form, 'Invalid token')
    }
    if (token == undefined || token.user == undefined) {
      console.error('Token or token user undefined: ', token)
      throw error(500, SERVER_ERROR);
    }

    try {
      await auth.updateKeyPassword('username', token.user.username, form.data.password);
      await auth.invalidateAllUserSessions(token.user.id);
      await passwordResetRepo.delete(token.user.id);
    } catch (e) {
      console.error(e)
      throw error(500, SERVER_ERROR);
    }

    throw redirect(303, '/login/resetPassword/success');
  },
}
