import type { PageServerLoad } from './$types';
import { CalendarEventRepo } from '$lib/calendarEvent';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const id = Number(params.id);

  try {
    const repo = new CalendarEventRepo(prisma);
    const calendarEvent = await repo.getOneAndValidateOwner(id, user.userId);

    return {
      calendarEvent,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throw error(401, { message: e.detail });
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};
