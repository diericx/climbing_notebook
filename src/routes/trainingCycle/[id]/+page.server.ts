import { APIError } from '$lib/errors';
import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import { getSignedUrlPromises } from '$lib/server/aws/s3';
import { prisma } from '$lib/server/prisma';
import { ProfileRepo } from '$lib/server/repos/profile';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { getSessionOrRedirect } from '$lib/utils';
import { exerciseGroupSchema, trainingCycleSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import type { Crumb } from 'svelte-breadcrumbs';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, params }) => {
  const session = await locals.auth.validate();
  const token = url.searchParams.get('token');

  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const profileRepo = new ProfileRepo(prisma);

  const profile = session == null ? null : await profileRepo.getOne(session?.user.userId);
  const trainingCycle = await trainingCycleRepo.getOne({
    id: Number(params.id),
    select: {
      ...trainingCycleSelects.everything,
      saves: {
        where: session ? { userId: session.user.userId } : undefined,
      },
    },
    userId: session?.user.userId,
    privateAccessToken: token || undefined,
  });

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

  // Feth s3 signed object URLs in order to display images
  const s3ObjectUrlPromises = getSignedUrlPromises(
    trainingCycle.owner.profile?.imageS3ObjectKey
      ? [trainingCycle.owner.profile.imageS3ObjectKey]
      : [],
  );

  return {
    trainingCycle,
    session,
    crumbs,
    s3ObjectUrlPromises,
    profile,
  };
};

export const actions: Actions = {
  delete: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);
    const trainingCycle = await repo.delete(id, user?.userId);

    return { success: true, trainingCycle };
  },

  duplicate: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const repo = new TrainingCycleRepo(prisma);
    await repo.duplicate(Number(params.id), user.userId);

    return { success: true };
  },

  save: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);

    await repo.save(id, user.userId);

    return { success: true };
  },

  unsave: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);

    await repo.unsave(id, user.userId);

    return { success: true };
  },

  activate: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);

    await repo.activate(id, user.userId);

    return { success: true };
  },

  deactivate: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);

    await repo.deactivate(id, user.userId);

    return { success: true };
  },

  // Set isPublic to true
  publish: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingCycleRepo(prisma);
    const cycle = await repo.getOne({
      id,
      select: { ownerId: true, description: true },
      userId: user.userId,
    });
    if (cycle.ownerId != user.userId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    if (!cycle.description) {
      throw new APIError(
        'INVALID_INPUT',
        'Training Cycle requires a description to be published. Be as descriptive as possible.',
      );
    }

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
    const form = await superValidate(formData, zod(trainingCycleSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.update(form.data, id, user?.userId);

    return { form };
  },

  _addExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const id = Number(params.id);
    const form = await superValidate(formData, zod(exerciseGroupSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.addExerciseGroup(form.data, id, user?.userId);

    return { form };
  },
  get addExerciseGroup() {
    return this._addExerciseGroup;
  },
  set addExerciseGroup(value) {
    this._addExerciseGroup = value;
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
