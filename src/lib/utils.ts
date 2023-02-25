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

