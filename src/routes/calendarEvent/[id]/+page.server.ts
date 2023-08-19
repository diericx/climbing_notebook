import type { Actions } from './$types';
import { CalendarEventRepo, calendarEventSchema } from '$lib/calendarEvent';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { getSessionOrRedirect } from '$lib/utils';

export const actions: Actions = {
  edit: async ({ locals, params, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const id = Number(params.id);
    const form = await superValidate(formData, calendarEventSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CalendarEventRepo(prisma);
    await repo.update(form.data, id, user?.userId);

    return { success: true };
  },

  delete: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new CalendarEventRepo(prisma);
    await repo.delete(id, user?.userId);

    return { success: true };
  },
};
