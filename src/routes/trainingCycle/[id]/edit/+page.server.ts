import { ExerciseRepo } from '$lib/exercise';
import { prisma } from '$lib/prisma';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import type { Crumb } from 'svelte-breadcrumbs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const id = Number(params.id);

  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const trainingCycle = await trainingCycleRepo.getOneAndValidateOwner(Number(id), user?.userId);
  const exercises = await exerciseRepo.getSelect({
    _count: {
      select: {
        exerciseEvents: true,
      },
    },
    id: true,
    name: true,
    fieldsToShow: true,
  });

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
  };
};
