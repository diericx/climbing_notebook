import { chartActions } from "$lib/chart";
import { SERVER_ERROR } from "$lib/helperTypes";
import type { Chart, ExerciseEvent, Profile } from "@prisma/client";
import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Unprotected page, session may not exist
  const session = await locals.validate();

  if (!session || session.state != 'active') {
    return {}
  }

  let response = await fetch(`/api/profile/${session?.userId}`, {
    method: "GET",
  })
  if (!response.ok) {
    if (response.status == 404) {
      throw error(404, { message: "Profile not found" })
    }
    throw error(500, { message: SERVER_ERROR })
  }
  let data = await response.json();
  const profile: Profile = data.profile;

  // Get charts for user
  response = await fetch(`/api/chart`, {
    method: "GET",
  })
  if (!response.ok) {
    if (response.status == 404) {
      throw error(404, { message: "Charts not found" })
    }
    throw error(500, { message: SERVER_ERROR })
  }
  data = await response.json();
  const charts: Chart[] = data.charts;

  // Get exercise events in the past month for the charts
  const dateMin = new Date()
  dateMin.setDate(dateMin.getDate() - 31)
  response = await fetch(`/api/exerciseEvent?` + new URLSearchParams({
    dateMin: dateMin.toISOString(),
    dateMax: (new Date()).toISOString()
  }), {
    method: "GET",
  })
  if (!response.ok) {
    throw error(500, { message: SERVER_ERROR })
  }
  data = await response.json();
  const exerciseEvents: ExerciseEvent[] = data.exercises;

  return { profile, charts, exerciseEvents }
}

export const actions: Actions = {
  ...chartActions
}
