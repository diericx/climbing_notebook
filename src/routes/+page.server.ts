import { ChartRepo } from "$lib/chart";
import { APIError } from "$lib/errors";
import { ExerciseEventRepo } from "$lib/exerciseEvent";
import { SERVER_ERROR } from "$lib/helperTypes";
import { MetricRepo } from "$lib/metric";
import { prisma } from "$lib/prisma";
import { ProfileRepo } from "$lib/profile";
import type { Chart, Metric, Profile } from "@prisma/client";
import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Unprotected page, session may not exist
  const session = await locals.validate();
  const { user } = locals;

  if (!session || session.state != 'active') {
    return {}
  }

  const repo = new ProfileRepo(prisma);
  let profile: Profile;
  try {
    profile = await repo.getOne(Number(user?.userId));
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  // Get charts for user
  const chartRepo = new ChartRepo(prisma);
  let charts: Chart[];
  try {
    charts = await chartRepo.get(Number(user?.userId));
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
    exerciseEvents = await exerciseEventRepo.get(Number(user?.userId), dateMin, new Date());
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
    metrics = await metricRepo.get(Number(user?.userId), dateMin, new Date());
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return { profile, charts, exerciseEvents, metrics }
}
