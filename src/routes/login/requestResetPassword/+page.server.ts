import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { requestPasswordResetSchema } from '$lib/user';
import { message, superValidate } from 'sveltekit-superforms/server';
import { PasswordResetRepo } from '$lib/passwordReset';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

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
      const createSendEmailCommand = (toAddress, fromAddress) => {
        return new SendEmailCommand({
          Destination: {
            /* required */
            ToAddresses: [
              toAddress,
              /* more To-email addresses */
            ],
          },
          Message: {
            /* required */
            Body: {
              /* required */
              Html: {
                Charset: 'UTF-8',
                Data: `Click the link below to reset your password.
<br/>
<br/>
https://climbingnotebook.com/login/resetPassword?token=${token.token}
`,
              },
              Text: {
                Charset: 'UTF-8',
                Data: 'TEXT_FORMAT_BODY',
              },
            },
            Subject: {
              Charset: 'UTF-8',
              Data: 'ClimbingNotebook Password Reset',
            },
          },
          Source: fromAddress,
          ReplyToAddresses: [
            /* more items */
          ],
        });

      };
      const sendEmailCommand = createSendEmailCommand(
        form.data.email,
        'noreply@climbingnotebook.com'
      );
      const sesClient = new SESClient({ region: 'us-west-2' });
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
