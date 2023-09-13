import { APIError } from '$lib/errors';
import { exerciseGroupSchema } from '$lib/exerciseGroup';
import { prisma } from '$lib/prisma';
import { TrainingCycleRepo, trainingCycleSchema } from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import type { TrainingCycle } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { Crumb } from 'svelte-breadcrumbs';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, params }) => {
  const session = await locals.auth.validate();
  const token = url.searchParams.get('token');

  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const trainingCycle = await trainingCycleRepo.getOne(Number(params.id));
  // If no user is not signed in and the training program is not public, error out
  if (session === null) {
    if (!trainingCycle.isPublic && token != trainingCycle.privateAccessToken) {
      throw new APIError('INVALID_PERMISSIONS', 'This Training Cycle is private');
    }
  }

  // Manually override breadcrumbs to show training program path
  // if this is an embedded cycle.
  let crumbs = [{ title: trainingCycle.name }] as Crumb[];
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

  return { trainingCycle, session, crumbs };
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
