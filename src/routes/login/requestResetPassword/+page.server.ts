import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { requestPasswordResetSchema } from '$lib/user';
import { message, superValidate } from 'sveltekit-superforms/server';
import { PasswordResetRepo } from '$lib/passwordReset';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { createSendEmailCommand, sesClient } from '$lib/aws/ses';

export const actions: Actions = {
  requestResetPassword: async ({ request }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, requestPasswordResetSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const passwordResetRepo = new PasswordResetRepo(prisma);
    try {
      const token = await passwordResetRepo.newTokenForUser(form.data.email);
      const sendEmailCommand = createSendEmailCommand(
        form.data.email,
        `Click the link below to reset your password.
<br/>
<br/>
https://climbingnotebook.com/login/resetPassword?token=${token.token}
`
      );
      await sesClient.send(sendEmailCommand);
    } catch (e) {
      if (e instanceof APIError) {
        return message(form, 'Email is not recognized')
      } else {
        console.error(e);
        return message(form, 'Uknown error occured.')
      }
    }

    throw redirect(303, '/login/requestResetPassword/success');
  },
};
