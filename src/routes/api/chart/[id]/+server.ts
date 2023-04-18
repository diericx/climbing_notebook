import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import { SERVER_ERROR } from "$lib/helperTypes";
import { prisma } from "$lib/prisma";
import type { Chart } from "@prisma/client";
import { ChartFormData } from "$lib/chart";

export const GET: RequestHandler = async ({ locals, params }) => {
  const { user } = locals;
  const { id } = params;

  // Fetch one
  let chart: Chart;
  try {
    let charts = await prisma.chart.findMany({
      where: {
        ownerId: Number(user?.userId),
        id: Number(id),
      }
    }) as Chart[];
    if (charts.length == 0) {
      return json({ message: "Chart not found." }, { status: 404 })
    }
    chart = charts[0]
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ chart }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const { id } = params
  const { user } = locals

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 })
  }

  try {
    await prisma.chart.deleteMany({
      where: {
        id: Number(id),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({}, { status: 200 });
};

export const PATCH: RequestHandler = async ({ locals, request, url, params }) => {
  let data = await request.json();
  const { user } = locals;
  const { id } = params;

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 })
  }

  // Get form data
  let input = new ChartFormData(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 401 })
  }

  let result
  try {
    result = await prisma.chart.updateMany({
      data: {
        name: input.name,
        type: input.type,
        patternToMatch: input.patternToMatch,
        matchAgainst: input.matchAgainst,
        equation: input.equation,
      },
      where: {
        id: Number(id),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  if (result.count == 0) {
    return json({ message: "Chart not found." }, { status: 404 })
  }

  return json({ message: "Chart was updated succesfully" }, { status: 200 })
};
