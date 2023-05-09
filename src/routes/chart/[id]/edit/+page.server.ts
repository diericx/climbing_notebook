import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import { error } from 'console';
import { ChartRepo } from '$lib/chart';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import type { Chart } from '@prisma/client';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = Number(params.id);

  const repo = new ChartRepo(prisma);
  let chart: Chart;
  try {
    chart = await repo.getOne(id, user?.userId);
  } catch (e) {
    if (e instanceof APIError) {
      throw error(404, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    chart,
  };
};
