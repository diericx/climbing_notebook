import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { APIError } from '$lib/errors';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await locals.auth.validateUser();
  if (!user) {
    throw redirect(302, '/login?redirectTo=' + url.toString())
  }

  const id = Number(params.id);

  try {
    const repo = new TrainingProgramRepo(prisma);
    const trainingProgram = await repo.getOne(Number(id), user?.userId);

    return {
      trainingProgram,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throw error(404, {
        message: 'Not found'
      });
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

};
