import { redirect, type Action } from "@sveltejs/kit";

export function confirmDelete(e: MouseEvent) {
  if (!confirm('Are you sure you want to delete this?')) {
    e.preventDefault();
  }
}

export const enhancedFormAction = (next: Action) => {
  return async function(context) {
    const { request, url } = context;
    // Get form data
    const formData = Object.fromEntries((await request.formData()).entries());
    const redirectTo = (formData.redirectTo || url.searchParams.get("redirectTo") || undefined)

    // Capture value of the form action call
    const nextValue = await next({ ...context, redirectTo, formData })
    // Catch the case where we return a failure which should not redirect as the
    // form needs to be changed before another submission
    if (!redirectTo) {
      nextValue.data = {
        ...nextValue.data,
        redirectTo,
      }
      return nextValue
    }

    // Redirect if one has been set
    if (redirectTo) {
      throw redirect(303, formData.redirectTo.toString())
    }

    // Return form action value if no redirect has been made 
    return nextValue
  } satisfies Action
}

export function toNum(val: any, def: any): any {
  if (val != undefined && val != null && !isNaN(val)) {
    return Number(val)
  }
  return def
}

export function matchMetricsInString(s: string) {
  return s.match(/^[a-zA-Z0-9]*: [0-9]*$/gm) || []
}

export function parseMetricStrings(s: string[]) {
  return s.map(_s => {
    const splitString = _s.split(': ')
    return {
      name: splitString[0],
      value: splitString[1]
    }
  }
  )
}

export function getMonday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}
