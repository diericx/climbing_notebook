import { json, error } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import type { RequestHandler } from "./$types";
import { isPasswordValid, isUsernameValid } from "$lib/user";
import { LuciaError } from "lucia-auth";
import { SERVER_ERROR } from "$lib/helperTypes";

export const POST: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json();

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
      return json({ message: "Incorrect username or password." }, { status: 400 })
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
