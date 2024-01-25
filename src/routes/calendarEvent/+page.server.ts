import { CalendarEventRepo } from '$lib/calendarEvent';
import { prisma } from '$lib/server/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import { calendarEventSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  new: async ({ request, url, locals }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, calendarEventSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CalendarEventRepo(prisma);
    await repo.new(form.data, user?.userId);

    return { success: true, form };
  },
};
