import type { Actions } from "./$types";
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { JournalEntry } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { JournalEntryRepo, JournalEntryFormData } from "$lib/journalEntry";
import { prisma } from "$lib/prisma";
import { APIError } from "$lib/errors";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = locals;
  const id = Number(params.id);

  const repo = new JournalEntryRepo(prisma);
  let journalEntry: JournalEntry;
  try {
    journalEntry = await repo.getOne(id, Number(user?.userId));
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    journalEntry,
  };
};

export const actions: Actions = {
  editJournalEntry: async ({ request, locals, params, url }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = locals;
    let id = Number(params.id);

    // Validate input fields
    const input = new JournalEntryFormData(rawFormData);
    let { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, journalEntryFormData: rawFormData })
    }

    const repo = new JournalEntryRepo(prisma);
    try {
      await repo.update(input, id, Number(user?.userId));
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, journalEntryFormData: rawFormData })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  deleteJournalEntry: async ({ locals, request, url }) => {
    const { user } = locals
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const id = Number(rawFormData.id)

    const repo = new JournalEntryRepo(prisma);
    try {
      await repo.delete(id, Number(user?.userId));
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
