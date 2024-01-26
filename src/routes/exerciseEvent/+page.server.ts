import { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import { ProfileRepo } from '$lib/profile';
import { prisma } from '$lib/server/prisma';
import { ExerciseRepo } from '$lib/server/repos/exercise';
import { ExerciseEventRepo } from '$lib/server/repos/exerciseEventRepo';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { TrainingProgramActivationRepo } from '$lib/trainingProgramActivation';
import {
  getActiveTrainingCycleForTrainingProgramActivation,
  getSessionOrRedirect,
} from '$lib/utils';
import { exerciseEventSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const exerciseEventsRepo = new ExerciseEventRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const profileRepo = new ProfileRepo(prisma);
  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const trainingProgramActivationRepo = new TrainingProgramActivationRepo(prisma);

  const exerciseEvents = await exerciseEventsRepo.getManyForUser({
    userId: user?.userId,
    select: exerciseEventSelects.minimal,
  });
  const profile = await profileRepo.getOne(user?.userId);
  const exercises = await exerciseRepo.getMany({
    select: ExerciseRepo.selectMinimal,
  });

  const activeCycles = await trainingCycleRepo.getManyForUser({
    userId: user.userId,
    query: 'owned',
    select: trainingCycleSelects.everything,
  });

  // Note: this does not filter for training programs that are active yet have
  // ended. This should be improved upon by upgrading prisma and using field
  // references to make the query more advanced
  const trainingProgramActivations = await trainingProgramActivationRepo.get({
    ownerId: user.userId,
    startDate: {
      lte: new Date(),
    },
  });

  const validTrainingProgramActivations = trainingProgramActivations.filter(
    (a) => getActiveTrainingCycleForTrainingProgramActivation(a) !== undefined
  );

  return {
    exercises,
    exerciseEvents,
    activeCycles,
    validTrainingProgramActivations,
    profile,
    user,
  };
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, exerciseEventSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ExerciseEventRepo(prisma);
    await repo.new(form.data, user?.userId);

    const exerciseToMarkCompletedId = formData.get('exerciseToMarkCompletedId');
    const dateToMarkCompleted = formData.get('dateToMarkCompleted');
    if (exerciseToMarkCompletedId != null && dateToMarkCompleted != null) {
      await repo.setCompleted(
        Number(exerciseToMarkCompletedId),
        user?.userId,
        new Date(dateToMarkCompleted.toString()),
        true
      );
    }

    return { form };
  },
};
