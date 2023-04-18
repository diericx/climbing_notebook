import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import type { Chart, Metric } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { prisma } from "$lib/prisma";
import { ChartFormData } from "$lib/chart";

export const GET: RequestHandler = async ({ locals, url }) => {
  const { user } = locals;

  const dateMin = url.searchParams.get('dateMin') ?? undefined
  const dateMax = url.searchParams.get('dateMax') ?? undefined

  // Fetch all
  let metrics: Metric[];
  try {
    metrics = await prisma.metric.findMany({
      where: {
        ownerId: Number(user?.userId),
        date: {
          lte: dateMax ? new Date(dateMax) : undefined,
          gte: dateMin ? new Date(dateMin) : undefined,
        },
      },
      orderBy: {
        date: 'desc',
      },
    }) as Metric[];
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ metrics }, { status: 200 });
};
