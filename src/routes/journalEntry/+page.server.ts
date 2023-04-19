import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import { error, fail, redirect } from "@sveltejs/kit";
import { JournalEntryRepo, JournalEntryFormData } from "$lib/journalEntry";
import { prisma } from "$lib/prisma";
import { SERVER_ERROR } from "$lib/helperTypes";
import { APIError } from "$lib/errors";

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = locals;
  const repo = new JournalEntryRepo(prisma);
  let journalEntries;
  try {
    journalEntries = await repo.get(Number(user?.userId));
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    journalEntries,
  };
};

export const actions: Actions = {
  newJournalEntry: async ({ request, url, locals }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = locals;

    // Validate input fields
    const input = new JournalEntryFormData(rawFormData);
    let { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, journalEntryFormData: rawFormData })
    }

    const repo = new JournalEntryRepo(prisma);
    try {
      await repo.new(input, Number(user?.userId))
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
}
