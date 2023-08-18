import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { APIError, throwAPIErrorAsHttpError } from '$lib/errors';
import { ExerciseRepo } from '$lib/exercise';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const id = Number(params.id);

  try {
    const trainingProgramRepo = new TrainingProgramRepo(prisma);
    const exerciseRepo = new ExerciseRepo(prisma);
    const trainingProgram = await trainingProgramRepo.getOneAndValidateOwner(
      Number(id),
      user?.userId
    );
    const exercises = await exerciseRepo.get({
      _count: {
        select: {
          exerciseEvents: true,
        },
      },
      id: true,
      name: true,
      fieldsToShow: true,
    });

    return {
      trainingProgram,
      exercises,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throwAPIErrorAsHttpError(e);
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};
