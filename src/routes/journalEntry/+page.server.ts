import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { JournalEntryRepo, journalEntrySchema } from '$lib/journalEntry';
import { prisma } from '$lib/prisma';
import { SERVER_ERROR } from '$lib/helperTypes';
import { APIError } from '$lib/errors';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();
  const repo = new JournalEntryRepo(prisma);
  let journalEntries;
  try {
    journalEntries = await repo.get(user?.userId);
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    journalEntries,
  };
};

export const actions: Actions = {
  newJournalEntry: async ({ request, url, locals }) => {
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(request, journalEntrySchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new JournalEntryRepo(prisma);
    try {
      await repo.new(form.data, user?.userId)
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
