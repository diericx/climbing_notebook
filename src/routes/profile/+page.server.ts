import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { ProfileRepo, profileSchema } from '$lib/profile';
import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { ExerciseEventRepo } from '$lib/exerciseEvent';
import { JournalEntryRepo } from '$lib/journalEntry';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { MetricRepo } from '$lib/metric';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const profileRepo = new ProfileRepo(prisma);
  const exerciseEventRepo = new ExerciseEventRepo(prisma);
  const journalEntryRepo = new JournalEntryRepo(prisma);
  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const metricsRepo = new MetricRepo(prisma);

  const profile = await profileRepo.getOne(user?.userId);
  const exerciseEvents = await exerciseEventRepo.get(user?.userId);
  const journalEntries = await journalEntryRepo.get(user?.userId);
  const trainingPrograms = await trainingProgramRepo.get(user?.userId);
  const metrics = await metricsRepo.get(user?.userId);
  return {
    profile,
    exerciseEvents,
    journalEntries,
    trainingPrograms,
    metrics,
    user,
  };
};

export const actions: Actions = {
  edit: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, profileSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProfileRepo(prisma);
    await repo.update(form.data, user?.userId);

    return { form };
  },
};
