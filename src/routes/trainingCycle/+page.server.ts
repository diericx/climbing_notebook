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

  const ownedTrainingCycles = await trainingCycleRepo.findMany({
    where: {
      // Default to empty string so query defaults to returning empty array
      ownerId: session?.user.userId || '',
      trainingProgramId: null,
    },
    select: {
      ...TrainingCycleRepo.selectMinimal,
      privateAccessToken: true,
      // NOTE: it would be ideal to not include this in the query if the user is null,
      // but if we set this to an optional variable the type is defined as always having
      // this value which makes it difficult to develop the front end.
      saves: { where: { userId: session?.user.userId || '' } },
      activations: { where: { userId: session?.user.userId || '' } },
    },
  });

  const savedTrainingCycles = await trainingCycleRepo.findMany({
    where: {
      saves: {
        some: {
          // Default to empty string so query defaults to returning empty array
          userId: session?.user.userId || '',
        },
      },
    },
    select: {
      ...TrainingCycleRepo.selectMinimal,
      // NOTE: it would be ideal to not include this in the query if the user is null,
      // but if we set this to an optional variable the type is defined as always having
      // this value which makes it difficult to develop the front end.
      saves: { where: { userId: session?.user.userId || '' } },
      activations: { where: { userId: session?.user.userId || '' } },
    },
  });

  const publicTrainingCycles = await trainingCycleRepo.findMany({
    where: {
      isPublic: true,
    },
    select: {
      ...TrainingCycleRepo.selectMinimal,
      // NOTE: it would be ideal to not include this in the query if the user is null,
      // but if we set this to an optional variable the type is defined as always having
      // this value which makes it difficult to develop the front end.
      saves: { where: { userId: session?.user.userId || '' } },
      activations: { where: { userId: session?.user.userId || '' } },
    },
  });

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
