import { prisma } from '$lib/server/prisma';
import { CalendarEventRepo } from '$lib/server/repos/calendarEvent';
import { getSessionOrRedirect } from '$lib/utils';
import { calendarEventSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  edit: async ({ locals, params, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const id = Number(params.id);
    const form = await superValidate(formData, zod(calendarEventSchema), {
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
