import { APIError } from '$lib/errors';
import { prisma } from '$lib/prisma';
import { TrainingCycleRepo, trainingCycleSchema } from '$lib/trainingCycle';
import {
  TrainingProgramRepo,
  trainingProgramScheduledSlotSchema,
  trainingProgramSchema,
} from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import type { TrainingProgram } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const session = await locals.auth.validate();
  const token = url.searchParams.get('token');

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const trainingProgram = await trainingProgramRepo.getOne(params.id);

  // If no user is not signed in and the training program is not public, error out
  if (session === null) {
    if (!trainingProgram.isPublic && token != trainingProgram.privateAccessToken) {
      throw new APIError('INVALID_PERMISSIONS', 'This Training Program is private');
    }
  }

  return { session, trainingProgram };
};

export const actions: Actions = {
  delete: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new TrainingProgramRepo(prisma);
    let trainingProgram: TrainingProgram;
    trainingProgram = await repo.delete(id, user?.userId);

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

  import: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const repo = new TrainingProgramRepo(prisma);
    await repo.import(params.id, user.userId);

    return { success: true };
  },

  // Set isPublic to true
  publish: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new TrainingProgramRepo(prisma);

    const program = await repo.getOneAndValidateOwner(id, user.userId);
    if (!program.description) {
      throw new APIError(
        'INVALID_INPUT',
        'Training Program requires a description to be published. Be as descriptive as possible.'
      );
    }

    await repo.update({ isPublic: true }, id, user.userId);

    return { success: true };
  },

  // Set isPublis to false
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
