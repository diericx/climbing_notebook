import { JournalEntryRepo } from '$lib/journalEntry';
import { prisma } from '$lib/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import { journalEntrySchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  edit: async ({ request, locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const form = await superValidate(request, journalEntrySchema);
    const id = Number(params.id);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new JournalEntryRepo(prisma);
    await repo.update(form.data, id, user?.userId);

    return { form };
  },

  delete: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const id = Number(params.id);

    const repo = new JournalEntryRepo(prisma);
    await repo.delete(id, user?.userId);

    return { success: true };
  },
};
