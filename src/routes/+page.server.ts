import { ChartRepo } from '$lib/chart';
import { APIError } from '$lib/errors';
import { ExerciseEventRepo } from '$lib/exerciseEvent';
import { SERVER_ERROR } from '$lib/helperTypes';
import { MetricRepo } from '$lib/metric';
import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import type { Chart, Metric, Profile } from '@prisma/client';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
  // Unprotected page, session may not exist
  const { user } = await locals.auth.validateUser();

  if (!user) {
    return {}
  }

  const repo = new ProfileRepo(prisma);
  let profile: Profile;
  try {
    profile = await repo.getOne(user?.userId);
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    return fail(500, { message: SERVER_ERROR })
  }

  // Get charts for user
  const chartRepo = new ChartRepo(prisma);
  let charts: Chart[];
  try {
    charts = await chartRepo.get(user?.userId);
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  // Get exercise events in the past month for the charts
  const dateMin = new Date()
  dateMin.setDate(dateMin.getDate() - 31)
  const exerciseEventRepo = new ExerciseEventRepo(prisma);
  let exerciseEvents;
  try {
    exerciseEvents = await exerciseEventRepo.get(user?.userId, dateMin, new Date());
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  // Get metris in the past month for the charts
  const metricRepo = new MetricRepo(prisma);
  let metrics: Metric[];
  try {
    metrics = await metricRepo.get(user?.userId, dateMin, new Date());
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return { profile, charts, exerciseEvents, metrics }
}

export const actions: Actions = {
  signout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) return fail(401);
    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);
  }
}
