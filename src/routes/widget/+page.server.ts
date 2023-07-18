import type { Actions } from './$types';
import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { superValidate } from 'sveltekit-superforms/server';
import { WidgetRepo, widgetSchema } from '$lib/widget';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await locals.auth.validateUser();
  if (!user) {
    throw redirect(302, '/login?redirectTo=' + url.toString());
  }

  const widgetRepo = new WidgetRepo(prisma);
  let widgets;
  try {
    widgets = await widgetRepo.get({ isTemplate: true });
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail });
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }

  return {
    widgets,
  };
};

export const actions: Actions = {
  new: async ({ locals, request }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, widgetSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      console.log(form);
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
