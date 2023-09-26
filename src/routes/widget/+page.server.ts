import { CustomQueryRepo, type CustomQueryResults } from '$lib/customQuery';
import { prisma } from '$lib/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import { WidgetRepo, widgetSchema } from '$lib/widget';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);

  const widgets = await widgetRepo.getAllPublishedOrOwnedTemplates(user.userId, {
    owner: true,
    datasets: {
      include: {
        customQueries: {
          include: {
            conditions: true,
          },
        },
      },
    },
  });
  // compile datasets for widgets
  const customQueryResults: CustomQueryResults[] = [];
  for (const w of widgets) {
    // Go through each widget and fetch cooresponding query results
    if (w.type == 'chart' || w.type == 'heatmapCalendar') {
      for (const dataset of w.datasets) {
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
  }
  return {
    user,
    customQueryResults,
    widgets,
  };
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const form = await superValidate(formData, widgetSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new WidgetRepo(prisma);
    const widget = await repo.new(form.data, user?.userId);

    // Redirect to the edit page for charts and heatmap calendars (basically charts)
    // because by default they are not complete and need more info
    if (widget.type == 'chart' || widget.type == 'heatmapCalendar') {
      throw redirect(303, `/widget/${widget.id}/edit`);
    }

    return { form };
  },
};
