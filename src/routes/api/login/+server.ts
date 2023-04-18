import { json } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import type { RequestHandler } from '@sveltejs/kit';
import { isPasswordValid, isUsernameValid } from "$lib/user";
import { LuciaError } from "lucia-auth";
import { SERVER_ERROR } from "$lib/helperTypes";

export const POST: RequestHandler = async ({ request }) => {
  let data = await request.json();
  const { username, password } = data;

  if (!isUsernameValid(username)) {
    return json({ message: "Username cannot be empty" }, { status: 401 })
  }
  if (!isPasswordValid(password)) {
    return json({ message: "Password cannot be empty" }, { status: 401 })
  }

  let user
  try {
    user = await auth.authenticateUser("username", username, password)
  } catch (e) {
    // Catch KNOWN duplicate username/provider id errors from both Lucia and the 
    // propogated Prisma erros.
    if (
      e instanceof LuciaError &&
      (e.message === 'AUTH_INVALID_PROVIDER_ID' ||
        e.message === 'AUTH_INVALID_PASSWORD' ||
        e.message === 'AUTH_INVALID_SESSION_ID')
    ) {
      return json({ message: "Incorrect username or password." }, { status: 401 })
    }

    // Print and communicate unknown errors
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  const session = await auth.createSession(user.userId);
  return json({
    session,
  });
};
