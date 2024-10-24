import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import { getSignedUrlPromises } from '$lib/server/aws/s3';
import { prisma } from '$lib/server/prisma';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { getSessionOrRedirect } from '$lib/utils';
import { trainingCycleSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  const trainingCycleRepo = new TrainingCycleRepo(prisma);

  const ownedTrainingCycles =
    session === null
      ? []
      : await trainingCycleRepo.getManyForUser({
          userId: session.user.userId,
          query: 'owned',
          extraFilters: {
            isTemplate: true,
          },
          select: {
            ...trainingCycleSelects.minimal,
            privateAccessToken: true,
            saves: { where: { userId: session.user.userId } },
            activations: { where: { userId: session.user.userId } },
          },
        });

  const savedTrainingCycles =
    session === null
      ? []
      : await trainingCycleRepo.getManyForUser({
          userId: session.user.userId,
          query: 'saved',
          select: {
            ...trainingCycleSelects.minimal,
            saves: { where: { userId: session?.user.userId } },
            activations: { where: { userId: session?.user.userId } },
          },
        });

  const publicTrainingCycles = await trainingCycleRepo.getAllPublic({
    ...trainingCycleSelects.minimal,
    // NOTE: it would be ideal to not include this in the query if the user is null,
    // but if we set this to an optional variable the type is defined as always having
    // this value which makes it difficult to develop the front end.
    saves: { where: { userId: session?.user.userId || '' } },
    activations: { where: { userId: session?.user.userId || '' } },
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
    const form = await superValidate(request, zod(trainingCycleSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.new(form.data, user?.userId);

    return { form };
  },
};
