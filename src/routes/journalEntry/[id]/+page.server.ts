import { prisma } from '$lib/server/prisma';
import { JournalEntryRepo } from '$lib/server/repos/journalEntry';
import { getSessionOrRedirect } from '$lib/utils';
import { journalEntrySchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  edit: async ({ request, locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const form = await superValidate(request, zod(journalEntrySchema));
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

  // Set isPublic to true
  publish: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new JournalEntryRepo(prisma);
    await repo.update({ isPublic: true }, id, user.userId);

    return { success: true };
  },

  // Set isPublic to false
  hide: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new JournalEntryRepo(prisma);

    await repo.update({ isPublic: false }, id, user.userId);

    return { success: true };
  },
};
