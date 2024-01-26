import { getSignedUrlPromises } from '$lib/aws/s3';
import { APIError } from '$lib/errors';
import { trainingProgramSelects } from '$lib/prismaHelpers/trainingProgramHelper';
import { prisma } from '$lib/server/prisma';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { TrainingProgramRepo } from '$lib/server/repos/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import {
  trainingCycleSchema,
  trainingProgramScheduledSlotSchema,
  trainingProgramSchema,
} from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const session = await locals.auth.validate();
  const token = url.searchParams.get('token');

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const trainingProgram = await trainingProgramRepo.getOne({
    id: params.id,
    userId: session?.user.userId,
    select: trainingProgramSelects.everything,
    privateAccessToken: token || undefined,
  });

  const s3ObjectUrlPromises = getSignedUrlPromises(
    trainingProgram.owner.profile?.imageS3ObjectKey
      ? [trainingProgram.owner.profile.imageS3ObjectKey]
      : []
  );

  return {
    session,
    trainingProgram,
    s3ObjectUrlPromises,
  };
};

export const actions: Actions = {
  delete: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new TrainingProgramRepo(prisma);
    const trainingProgram = await repo.delete(id, user?.userId);

    return { success: true, trainingProgram };
  },

  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const id = params.id;
    const form = await superValidate(formData, trainingProgramSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.update(form.data, id, user?.userId);

    return { form };
  },

  duplicate: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new TrainingProgramRepo(prisma);

    await repo.duplicate(id, user.userId);

    return { success: true };
  },

  save: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const repo = new TrainingProgramRepo(prisma);
    await repo.save(params.id, user.userId);

    return { success: true };
  },

  unsave: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const repo = new TrainingProgramRepo(prisma);
    await repo.unsave(params.id, user.userId);

    return { success: true };
  },

  // Set isPublic to true
  publish: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new TrainingProgramRepo(prisma);

    // Published programs require a desc, so get the program and validate this first
    const trainingProgramRepo = new TrainingProgramRepo(prisma);
    const trainingProgram = await trainingProgramRepo.getOne({
      id: params.id,
      userId: user.userId,
      select: trainingProgramSelects.everything,
    });
    if (!trainingProgram.description) {
      throw new APIError(
        'INVALID_INPUT',
        'Training Program requires a description to be published. Be as descriptive as possible.'
      );
    }

    await repo.update({ isPublic: true }, id, user.userId);

    return { success: true };
  },

  // Set isPublish to false
  hide: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new TrainingProgramRepo(prisma);

    await repo.update({ isPublic: false }, id, user.userId);

    return { success: true };
  },

  addTrainingCycle: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const id = params.id;
    const form = await superValidate(formData, trainingCycleSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.new(form.data, user?.userId, id);

    return { form };
  },

  addTrainingProgramScheduledSlot: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const id = params.id;
    const form = await superValidate(formData, trainingProgramScheduledSlotSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.addTrainingProgramScheduledSlot(form.data, id, user?.userId);

    return { form };
  },
};
