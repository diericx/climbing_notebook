
import { ChartRepo } from '$lib/chart';
import { APIError } from '$lib/errors';
import { ExerciseEventRepo } from '$lib/exerciseEvent';
import { SERVER_ERROR } from '$lib/helperTypes';
import { MetricRepo } from '$lib/metric';
import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { JournalEntryRepo } from '$lib/journalEntry';
import { CalendarEventRepo } from '$lib/calendarEvent';

export const load: PageServerLoad = async ({ locals }) => {
  // Unprotected page, session may not exist
  const { user } = await locals.auth.validateUser();

  const profileRepo = new ProfileRepo(prisma);
  const chartRepo = new ChartRepo(prisma);
  const exerciseEventRepo = new ExerciseEventRepo(prisma);
  const metricRepo = new MetricRepo(prisma);
  const journalEntryRepo = new JournalEntryRepo(prisma);
  const calendarEventRepo = new CalendarEventRepo(prisma);

  try {
    const profile = await profileRepo.getOne(user?.userId);
    const charts = await chartRepo.get(user?.userId);
    // Get exercise events in the past month for the charts
    const dateMin = new Date()
    dateMin.setDate(dateMin.getDate() - 31)
    const exerciseEvents = await exerciseEventRepo.get(user?.userId, dateMin, new Date());
    // Get metris in the past month for the charts
    const metrics = await metricRepo.get(user?.userId, dateMin, new Date());
    const journalEntries = await journalEntryRepo.get(user?.userId);
    const calendarEvents = await calendarEventRepo.get(user?.userId);

    return { user, profile, charts, exerciseEvents, metrics, journalEntries, calendarEvents }
  } catch (e) {
    if (e instanceof APIError) {
      throw error(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }
}

export const actions: Actions = {
  signout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) return fail(401);
    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);
  }
}
