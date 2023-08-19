import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { JournalEntryRepo, journalEntrySchema } from '$lib/journalEntry';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { superValidate } from 'sveltekit-superforms/server';
import { getSessionOrRedirect } from '$lib/utils';

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

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },

  delete: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const id = Number(params.id);

    const repo = new JournalEntryRepo(prisma);
    try {
      await repo.delete(id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },
};
