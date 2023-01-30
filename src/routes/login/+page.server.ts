import type { Actions } from "./$types";
import { fail, redirect } from '@sveltejs/kit';
import type { PageLoad } from "../$types";

export const load: PageLoad = ({ url }) => {
  return {
    redirectTo: url.searchParams.get("redirectTo")
  }
}

export const actions: Actions = {
  login: async ({ request, fetch, locals }) => {
    const data = await request.formData();
    const redirectTo = data.get("redirectTo");
    const username = data.get("username");
    const password = data.get("password");
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      })
    })

    if (response.ok) {
      let data = await response.json();
      locals.setSession(data.session);
      throw redirect(303, redirectTo?.toString() || "/profile");
    }

    const result = await response.json();
    console.error(result);
    return fail(500, {
      message: result.message,
      username,
      redirectTo
    })
  },

  register: async ({ request, fetch }) => {
    const data = await request.formData();
    const redirectTo = data.get("redirectTo");
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
      })
    })

    if (response.ok) {
      throw redirect(303, redirectTo?.toString() || "/profile");
    }

    const result = await response.json();
    console.error(result);
    return fail(500, {
      message: result.message,
      username,
      email,
      redirectTo
    })
  }
};
