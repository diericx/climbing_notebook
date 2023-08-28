import { prisma } from '$lib/prisma';
import { TrainingCycleRepo, trainingCycleSchema } from '$lib/trainingCycle';
import { TrainingProgramRepo, trainingProgramSchema } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import type { TrainingProgram } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const trainingProgram = await trainingProgramRepo.getOneAndValidateOwner(params.id, user.userId);
  return { trainingProgram };
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
};
