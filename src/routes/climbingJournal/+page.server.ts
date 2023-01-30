import type { Actions } from "./$types";
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { JournalEntry } from "@prisma/client";

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Protected page
  const session = await locals.validate();
  if (!session) {
    throw redirect(302, "/login?redirectTo=climbingJournal")
  }

  const response = await fetch("/api/journalEntry", {
    method: "GET",
  })
  const data = await response.json();
  const journalEntries: JournalEntry[] = data.journalEntries;

  return {
    journalEntries,
  };
}

export const actions: Actions = {
  new: async ({ request, fetch }) => {
    // Get journalEntry from form data
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());

    const response = await fetch("/api/journalEntry", {
      method: "POST",
      body: JSON.stringify(input),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        journalEntryInput: input
      })
    }
    return data;
  },

  delete: async ({ request, fetch }) => {
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/journalEntry/${input.id}`, {
      method: "DELETE",
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
      })
    }

    return data;
  }
}
