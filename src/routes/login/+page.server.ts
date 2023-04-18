import type { Actions } from "./$types";
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  login: async ({ request, fetch, locals, url }) => {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      })
    })

    const result = await response.json();

    if (!response.ok) {
      console.error(response);
      return fail(500, {
        message: result.message,
        username,
      })
    }

    locals.setSession(result.session);

    throw redirect(303, url.searchParams.get('redirectTo') || '/');
  },

  register: async ({ request, fetch, url }) => {
    const data = await request.formData();
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

    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      return fail(500, {
        message: result.message,
        username,
        email,
      })
    }

    throw redirect(303, url.searchParams.get('redirectTo') || '/');
  }
};
