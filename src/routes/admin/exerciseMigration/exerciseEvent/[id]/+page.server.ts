import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { exerciseEventSchema } from '$lib/exerciseEvent';
import { APIError } from '$lib/errors';
import { prisma } from '$lib/prisma';
import { superValidate } from 'sveltekit-superforms/server';

export const actions: Actions = {
  edit: async ({ request, url }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, exerciseEventSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await prisma.exerciseEvent.updateMany({
        where: {
          name: {
            equals: form.data.name,
          }
        },
        data: {
          exerciseId: form.data.exerciseId
        }
      })
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
}
