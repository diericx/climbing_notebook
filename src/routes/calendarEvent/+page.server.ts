import { CalendarEventFormData, CalendarEventRepo } from '$lib/calendarEvent';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  newCalendarEvent: async ({ request, url, locals }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();

    // Validate input fields
    const input = new CalendarEventFormData(rawFormData);
    const { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, journalEntryFormData: rawFormData })
    }

    const repo = new CalendarEventRepo(prisma);
    try {
      await repo.new(input, user?.userId)
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
