import { CustomQueryRepo, type CustomQueryResults } from '$lib/customQuery';
import { APIError, throwAPIErrorAsHttpError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { WidgetRepo, widgetSchema, widgetTemplateSchema } from '$lib/widget';
import { error, fail, redirect } from '@sveltejs/kit';
import { typeOf } from 'mathjs';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });
  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);
  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const id = params.id;

  try {
    const widget = await widgetRepo.getOne(id);
    // This page is only for template widgets
    if (!widget.isTemplate) {
      throw new APIError('INVALID_INPUT', 'Only template widgets can be viewed individually');
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
      user,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throwAPIErrorAsHttpError(e);
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};

export const actions: Actions = {
  update: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
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
        throwAPIErrorAsHttpError(e);
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },

  publish: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new WidgetRepo(prisma);
    try {
      await repo.update({ isPublished: true }, id, user?.userId);
    } catch (e) {
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }
  },

  hide: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new WidgetRepo(prisma);
    try {
      await repo.update({ isPublished: false }, id, user?.userId);
    } catch (e) {
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }
  },

  delete: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

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
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
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

  addToMyDashboard: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const id = params.id;

    const repo = new WidgetRepo(prisma);
    try {
      await repo.duplicateTemplateAsDashboardWidget(id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        console.error(e);
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
};
