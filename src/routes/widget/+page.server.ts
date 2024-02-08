import { widgetSelects } from '$lib/prismaHelpers/widgetHelper';
import { getSignedUrlPromises } from '$lib/server/aws/s3';
import { prisma } from '$lib/server/prisma';
import { CustomQueryRepo, type CustomQueryResults } from '$lib/server/repos/customQuery';
import { WidgetRepo } from '$lib/server/repos/widgetRepo';
import { getSessionOrRedirect } from '$lib/utils';
import { widgetSchema } from '$lib/zodSchemas';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);

  const widgets = await widgetRepo.getManyForUserPublishedOrOwnedTemplates(
    user.userId,
    widgetSelects.everything
  );
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

  const s3ObjectUrlPromises = getSignedUrlPromises(
    widgets.reduce((acc, cur) => {
      if (cur.owner.profile?.imageS3ObjectKey) {
        return [...acc, cur.owner.profile.imageS3ObjectKey];
      }
      return acc;
    }, [] as string[])
  );

  return {
    user,
    customQueryResults,
    widgets,
    s3ObjectUrlPromises,
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
      redirect(303, `/widget/${widget.id}/edit`);
    }

    return { form };
  },
};
