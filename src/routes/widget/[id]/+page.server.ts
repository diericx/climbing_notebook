import { CustomQueryRepo, type CustomQueryResults } from '$lib/customQuery';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { datasetSchema, WidgetRepo, widgetSchema, widgetTemplateSchema } from '$lib/widget';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);
  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const id = params.id;

  try {
    const widget = await widgetRepo.getOne(id);
    // Non-template widgets can only be viewed by their owner
    if (!widget.isTemplate && user?.userId != widget.ownerId) {
      throw error(403, 'You do not have permission to view this resource');
    }

    const trainingPrograms = await trainingProgramRepo.get(user?.userId);
    // compile datasets for widgets
    const customQueryResults: CustomQueryResults[] = [];
    // Go through each widget and fetch cooresponding query results
    if (widget.type == 'chart' || widget.type == 'heatmapCalendar') {
      for (const dataset of widget.datasets) {
        for (const customQuery of dataset.customQueries) {
          // Don't run the same queries multiple times
          if (customQueryResults.find((r) => r.customQueryId == customQuery.id)) {
            continue;
          }

          const data = await customQueryRepo.runCustomQuery(customQuery.id, user?.userId);
          customQueryResults.push({
            customQueryId: customQuery.id,
            data,
          });
        }
      }
    }

    return {
      widget,
      trainingPrograms,
      customQueryResults,
    };
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};

export const actions: Actions = {
  update: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, widgetSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const id = params.id;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new WidgetRepo(prisma);
    try {
      await repo.update(form.data, id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
  delete: async ({ locals, url, params }) => {
    const id = params.id;
    const { user } = await locals.auth.validateUser();

    const repo = new WidgetRepo(prisma);
    try {
      await repo.delete(id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return {};
  },

  // Create a new template from this widget
  newTemplate: async ({ locals, url, params, request }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, widgetTemplateSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const id = params.id;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new WidgetRepo(prisma);
    try {
      await repo.newTemplate(form.data, id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
