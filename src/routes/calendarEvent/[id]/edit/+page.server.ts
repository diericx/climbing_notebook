import { CalendarEventRepo } from '$lib/calendarEvent';
import { prisma } from '$lib/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const id = Number(params.id);

  const repo = new CalendarEventRepo(prisma);
  const calendarEvent = await repo.getOne({
    id,
    userId: user.userId,
    select: CalendarEventRepo.selectEverything,
  });

  return {
    calendarEvent,
  };
};
