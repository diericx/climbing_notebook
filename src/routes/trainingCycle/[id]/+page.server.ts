import { APIError } from '$lib/errors';
import { exerciseGroupSchema } from '$lib/exerciseGroup';
import { prisma } from '$lib/prisma';
import {
  TrainingCycleRepo,
  trainingCycleSchema,
  trainingCycleTemplateSchema,
} from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import type { TrainingCycle } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  const session = await locals.auth.validate();

  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const trainingCycle = await trainingCycleRepo.getOne(Number(params.id));
  // If no user is not signed in and the training program is not public, error out
  if (!trainingCycle.isPublic && session === null) {
    throw new APIError('INVALID_PERMISSIONS', 'This Training Program is private');
  }
  return { trainingCycle, session };
};

export const actions: Actions = {
  delete: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);
    let trainingCycle: TrainingCycle;
    trainingCycle = await repo.delete(id, user?.userId);

    return { success: true, trainingCycle };
  },

  duplicate: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const repo = new TrainingCycleRepo(prisma);
    await repo.duplicate(Number(params.id), user.userId);

    return { success: true };
  },

  // Same as duplicate but assumed it is being called on a template so
  // it will set isPublic to false and parentID
  import: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);

    await repo.importTemplate(id, user.userId);

    return { success: true };
  },

  // Set isPublic to true
  publish: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);

    await repo.update({ isPublic: true }, id, user.userId);

    return { success: true };
  },

  // Set isPublic to false
  hide: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);

    await repo.update({ isPublic: false }, id, user.userId);

    return { success: true };
  },

  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const id = Number(params.id);
    const form = await superValidate(formData, trainingCycleSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.update(form.data, id, user?.userId);

    return { form };
  },

  newTemplate: async ({ locals, url, request, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const id = Number(params.id);
    const form = await superValidate(formData, trainingCycleTemplateSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.newTemplate(form.data, id, user?.userId);

    return { success: true };
  },

  addExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const id = Number(params.id);
    const form = await superValidate(formData, exerciseGroupSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.addExerciseGroup(form.data, id, user?.userId);

    return { form };
  },

  deleteExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const id = Number(params.id);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);

    const repo = new TrainingCycleRepo(prisma);
    await repo.deleteExerciseGroup(id, user?.userId, exerciseGroupId);

    return {};
  },
};
