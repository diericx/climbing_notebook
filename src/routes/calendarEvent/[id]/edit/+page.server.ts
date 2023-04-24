import type { Actions, PageServerLoad } from './$types';
import { CalendarEventFormData, CalendarEventRepo } from '$lib/calendarEvent';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import type { CalendarEvent } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = Number(params.id);

  const repo = new CalendarEventRepo(prisma);
  let calendarEvent: CalendarEvent;
  try {
    calendarEvent = await repo.getOne(id, user?.userId);
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    calendarEvent,
  };
};

export const actions: Actions = {
  editCalendarEvent: async ({ locals, params, request, url }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);

    // Validate input fields
    const input = new CalendarEventFormData(rawFormData);
    const { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, calendarEventFormData: rawFormData })
    }

    const repo = new CalendarEventRepo(prisma);
    try {
      await repo.update(input, id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, calendarEventFormData: rawFormData })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  deleteCalendarEvent: async ({ locals, request, url }) => {
    const { user } = await locals.auth.validateUser();
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const id = Number(rawFormData.id)

    const repo = new CalendarEventRepo(prisma);
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
