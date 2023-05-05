import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { JournalEntry } from '@prisma/client';
import { SERVER_ERROR } from '$lib/helperTypes';
import { JournalEntryRepo, journalEntrySchema } from '$lib/journalEntry';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = Number(params.id);

  const repo = new JournalEntryRepo(prisma);
  let journalEntry: JournalEntry;
  try {
    journalEntry = await repo.getOne(id, user?.userId);
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  const form = await superValidate(journalEntry, journalEntrySchema);
  return {
    journalEntry,
    form,
  };
};

export const actions: Actions = {
  editJournalEntry: async ({ request, locals, params, url }) => {
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(request, journalEntrySchema);
    const id = Number(params.id);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new JournalEntryRepo(prisma);
    try {
      await repo.update(form.data, id, user?.userId);
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

  deleteJournalEntry: async ({ locals, request, url }) => {
    const { user } = await locals.auth.validateUser();
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const id = Number(rawFormData.id)

    const repo = new JournalEntryRepo(prisma);
    try {
      await repo.delete(id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },
}
