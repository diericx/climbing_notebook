import { exerciseSelects } from '$lib/prismaHelpers/exerciseHelper';
import { prisma } from '$lib/server/prisma';
import { ExerciseRepo } from '$lib/server/repos/exercise';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.auth.validate();
  if (session === null) {
    throw error(403);
  }

  const query = url.searchParams.get('q') || undefined;
  const limit = Number(url.searchParams.get('limit')) || undefined;

  const exerciseRepo = new ExerciseRepo(prisma);
  const exercises = await exerciseRepo.searchByName({
    select: exerciseSelects.minimal,
    nameQuery: query,
    limit: limit,
  });

  return json(exercises);
};
