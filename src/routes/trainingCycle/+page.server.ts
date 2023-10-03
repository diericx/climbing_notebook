import { getSignedUrlPromises } from '$lib/aws/s3';
import { prisma } from '$lib/prisma';
import { TrainingCycleRepo, trainingCycleSchema } from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  const trainingCycleRepo = new TrainingCycleRepo(prisma);

  const ownedTrainingCycles = await trainingCycleRepo.get(
    {
      // Default to empty string so query defaults to returning empty array
      ownerId: session?.user.userId || '',
      trainingProgramId: null,
    },
    undefined,
    session ? { where: { userId: session.user.userId } } : undefined
  );

  const savedTrainingCycles = await trainingCycleRepo.get(
    {
      saves: {
        some: {
          // Default to empty string so query defaults to returning empty array
          userId: session?.user.userId || '',
        },
      },
    },
    session ? { where: { userId: session.user.userId } } : undefined,
    session ? { where: { userId: session.user.userId } } : undefined
  );

  const publicTrainingCycles = await trainingCycleRepo.get(
    {
      isPublic: true,
    },
    session ? { where: { userId: session.user.userId } } : undefined,
    session ? { where: { userId: session.user.userId } } : undefined
  );

  const s3ObjectUrlPromises = getSignedUrlPromises([
    ...ownedTrainingCycles.reduce((acc, cur) => {
      if (cur.owner.profile?.imageS3ObjectKey) {
        return [...acc, cur.owner.profile.imageS3ObjectKey];
      }
      return acc;
    }, [] as string[]),
    ...savedTrainingCycles.reduce((acc, cur) => {
      if (cur.owner.profile?.imageS3ObjectKey) {
        return [...acc, cur.owner.profile.imageS3ObjectKey];
      }
      return acc;
    }, [] as string[]),
    ...publicTrainingCycles.reduce((acc, cur) => {
      if (cur.owner.profile?.imageS3ObjectKey) {
        return [...acc, cur.owner.profile.imageS3ObjectKey];
      }
      return acc;
    }, [] as string[]),
  ]);

  return {
    ownedTrainingCycles,
    savedTrainingCycles,
    publicTrainingCycles,
    session,
    s3ObjectUrlPromises,
  };
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const form = await superValidate(request, trainingCycleSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.new(form.data, user?.userId);

    return { form };
  },
};
