import { getSignedUrlPromises } from '$lib/aws/s3';
import dayjs from '$lib/dayjs';
import { prisma } from '$lib/prisma';
import {
  trainingProgramActivationSchema,
  TrainingProgramRepo,
  trainingProgramSchema,
} from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  const trainingProgramRepo = new TrainingProgramRepo(prisma);

  const ownedTrainingPrograms = await trainingProgramRepo.get({
    // Default to empty string so query defaults to returning empty array
    ownerId: session?.user.userId || '',
  });

  const savedTrainingPrograms = await trainingProgramRepo.get(
    {
      saves: {
        some: {
          // Default to empty string so query defaults to returning empty array
          userId: session?.user.userId || '',
        },
      },
    },
    session ? { userId: session.user.userId } : undefined
  );

  const publicTrainingPrograms = await trainingProgramRepo.get(
    {
      isPublic: true,
    },
    session ? { userId: session.user.userId } : undefined
  );

  const s3ObjectUrlPromises = await getSignedUrlPromises([
    ...ownedTrainingPrograms.reduce((acc, cur) => {
      if (cur.owner.profile?.imageS3ObjectKey) {
        return [...acc, cur.owner.profile.imageS3ObjectKey];
      }
      return acc;
    }, [] as string[]),
    ...savedTrainingPrograms.reduce((acc, cur) => {
      if (cur.owner.profile?.imageS3ObjectKey) {
        return [...acc, cur.owner.profile.imageS3ObjectKey];
      }
      return acc;
    }, [] as string[]),
    ...publicTrainingPrograms.reduce((acc, cur) => {
      if (cur.owner.profile?.imageS3ObjectKey) {
        return [...acc, cur.owner.profile.imageS3ObjectKey];
      }
      return acc;
    }, [] as string[]),
  ]);

  return {
    ownedTrainingPrograms,
    savedTrainingPrograms,
    publicTrainingPrograms,
    session,
    s3ObjectUrlPromises,
  };
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const form = await superValidate(request, trainingProgramSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.new(form.data, user?.userId);

    return { form };
  },

  newActivation: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const form = await superValidate(request, trainingProgramActivationSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    if (dayjs(form.data.startDate).day() > 1) {
      return setError(form, 'startDate', 'Start Date must be on a Monday or Sunday');
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.newActivation(form.data, user?.userId);

    return { form };
  },
};
