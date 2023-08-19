import type { Actions } from './$types';
import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { APIError, throwAPIErrorAsHttpError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { WidgetRepo, widgetSchema } from '$lib/widget';
import type { PageServerLoad } from './$types';
import { CustomQueryRepo, type CustomQueryResults } from '$lib/customQuery';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);

  try {
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
  } catch (e) {
    if (e instanceof APIError) {
      throwAPIErrorAsHttpError(e);
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
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
    let widget;
    try {
      widget = await repo.new(form.data, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    // Redirect to the edit page for charts and heatmap calendars (basically charts)
    // because by default they are not complete and need more info
    if (widget.type == 'chart' || widget.type == 'heatmapCalendar') {
      throw redirect(303, `/widget/${widget.id}/edit`);
    }

    return { form };
  },
};
