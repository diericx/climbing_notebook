import { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
import { prisma } from '$lib/server/prisma';
import { ExerciseEventRepo } from '$lib/server/repos/exerciseEventRepo';
import { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Create a type for the API response and
// remove any types that are not primitives in JSON
export type APIExerciseEventsResponse = (Prisma.ExerciseEventGetPayload<
  typeof exerciseEventSelects.minimalValidator
> & { date: string })[];

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.auth.validate();
  if (session === null) {
    throw error(403);
  }

  const user = session.user;
  const exerciseEventRepo = new ExerciseEventRepo(prisma);

  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');

  if (start == null) {
    throw error(401, 'Must specify start date');
  }
  if (end == null) {
    throw error(401, 'Must specify end date');
  }

  // Workaround for time zone adjustmants made by date... and the fact that
  // date coming from calendar is not full iso string... lame
  const startDate = new Date(start);
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setUTCHours(0, 0, 0, 0);

  const exerciseEvents = await exerciseEventRepo.getManyForUser({
    userId: user?.userId,
    select: exerciseEventSelects.minimal,
    dateMin: startDate,
    // This is inclusive but should be exclusive... may cause issues
    dateMax: endDate,
  });

  return json(exerciseEvents);
};
