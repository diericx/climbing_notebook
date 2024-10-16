import { APIError } from '$lib/errors';
import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import { widgetSelects } from '$lib/prismaHelpers/widgetHelper';
import { getSignedUrlPromises } from '$lib/server/aws/s3';
import { prisma } from '$lib/server/prisma';
import { CustomQueryRepo, type CustomQueryResults } from '$lib/server/repos/customQuery';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { WidgetRepo } from '$lib/server/repos/widgetRepo';
import { getSessionOrRedirect } from '$lib/utils';
import { widgetSchema, widgetTemplateSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });
  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);
  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const id = params.id;

  const widget = await widgetRepo.getOne({
    id,
    userId: user.userId,
    select: widgetSelects.everything,
  });
  // This page is only for template widgets
  if (!widget.isTemplate) {
    throw new APIError('INVALID_INPUT', 'Only template widgets can be viewed individually');
  }

  const trainingCycles = await trainingCycleRepo.getManyForUser({
    userId: user.userId,
    query: 'owned',
    select: trainingCycleSelects.nameAndId,
  });
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

  const s3ObjectUrlPromises = getSignedUrlPromises(
    widget.owner.profile?.imageS3ObjectKey ? [widget.owner.profile.imageS3ObjectKey] : [],
  );

  return {
    widget,
    trainingCycles,
    customQueryResults,
    user,
    s3ObjectUrlPromises,
  };
};

export const actions: Actions = {
  update: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const form = await superValidate(formData, zod(widgetSchema), {
      id: formData.get('_formId')?.toString(),
    });
    const id = params.id;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new WidgetRepo(prisma);
    await repo.update(form.data, id, user?.userId);

    return { form };
  },

  publish: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new WidgetRepo(prisma);
    await repo.update({ isPublished: true }, id, user?.userId);
  },

  hide: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new WidgetRepo(prisma);
    await repo.update({ isPublished: false }, id, user?.userId);
  },

  delete: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new WidgetRepo(prisma);
    await repo.delete(id, user?.userId);

    return {};
  },

  // Create a new template from this widget
  newTemplate: async ({ locals, url, params, request }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(widgetTemplateSchema), {
      id: formData.get('_formId')?.toString(),
    });
    const id = params.id;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new WidgetRepo(prisma);
    await repo.newTemplate(form.data, id, user?.userId);

    return { form };
  },

  addToMyDashboard: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const id = params.id;

    const repo = new WidgetRepo(prisma);
    await repo.duplicateTemplateAsDashboardWidget(id, user?.userId);

    return {};
  },
};
