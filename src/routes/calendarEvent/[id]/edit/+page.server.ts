import type { Actions, PageServerLoad } from './$types';
import { CalendarEventRepo, calendarEventSchema } from '$lib/calendarEvent';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = Number(params.id);

  try {
    const repo = new CalendarEventRepo(prisma);
    const calendarEvent = await repo.getOne(id, user?.userId);

    return {
      calendarEvent,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throw error(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }
};

export const actions: Actions = {
  editCalendarEvent: async ({ locals, params, request, url }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);
    const form = await superValidate(formData, calendarEventSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CalendarEventRepo(prisma);
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
