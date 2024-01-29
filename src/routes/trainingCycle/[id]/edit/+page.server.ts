import { exerciseSelects } from '$lib/prismaHelpers/exerciseHelper';
import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import { prisma } from '$lib/server/prisma';
import { ExerciseRepo } from '$lib/server/repos/exercise';
import { ProfileRepo } from '$lib/server/repos/profile';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { getSessionOrRedirect } from '$lib/utils';
import type { Crumb } from 'svelte-breadcrumbs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const id = Number(params.id);

  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const profileRepo = new ProfileRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const trainingCycle = await trainingCycleRepo.getOne({
    id: Number(id),
    select: trainingCycleSelects.everything,
    userId: user.userId,
  });

  const exercises = await exerciseRepo.getMany({
    select: exerciseSelects.minimal,
  });

  const profile = await profileRepo.getOne(user?.userId);

  // Manually override breadcrumbs to show training program path
  // if this is an embedded cycle.
  let crumbs = [
    { title: trainingCycle.name, url: `/trainingCycle/${trainingCycle.id}` },
    { title: 'Edit' },
  ] as Crumb[];
  if (trainingCycle.trainingProgram) {
    crumbs = [
      { title: 'Training Programs', url: `/trainingProgram` },
      {
        title: trainingCycle.trainingProgram.name,
        url: `/trainingProgram/${trainingCycle.trainingProgramId}/edit`,
      },
      { title: 'Training Cycles', url: `/trainingProgram/${trainingCycle.trainingProgramId}/edit` },
      ...crumbs,
    ];
  } else {
    crumbs = [{ title: 'Training Cycles', url: `/trainingCycle` }, ...crumbs];
  }

  return {
    trainingCycle,
    exercises,
    crumbs,
    profile,
  };
};
