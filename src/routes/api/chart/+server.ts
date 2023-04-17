import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import type { Chart } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { ChartFormData } from "$lib/chart";

export const GET: RequestHandler = protectedEndpoint(async ({ locals }) => {
  const { user } = locals;

  // Fetch all
  let charts: Chart[];
  try {
    charts = await prisma.chart.findMany({
      where: {
        ownerId: Number(user?.userId),
      },
      orderBy: {
        name: 'desc',
      },
    }) as Chart[];
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ charts }, { status: 200 });
});

export const POST: RequestHandler = protectedEndpoint(async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = ChartFormData.fromObject(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 403 });
  }

  let chart: Chart;
  try {
    chart = await prisma.chart.create({
      data: {
        name: input.name,
        type: input.type,
        patternToMatch: input.patternToMatch,
        matchAgainst: input.matchAgainst,
        equation: input.equation,
        ownerId: Number(user?.userId),
      }
    }) as Chart;
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ chart }, { status: 201 });
});

