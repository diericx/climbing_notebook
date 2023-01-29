import { json, error } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import type { RequestHandler } from "./$types";
import { isPasswordValid, isUsernameValid } from "$lib/user";
import { LuciaError } from "lucia-auth";

export const POST: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json();

  if (!isUsernameValid(username)) {
    throw error(401, { message: "Username cannot be empty" });
  }
  if (!isPasswordValid(password)) {
    throw error(401, { message: "Password cannot be empty" });
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
      throw error(400, {
        message: 'Incorrect username or password.'
      });
    }

    // Print and communicate unknown errors
    console.error(e);
    throw error(500, {
      message: "An error occured on our end. Please try again later."
    })
  }

  const session = await auth.createSession(user.userId);
  return json({
    session,
  });
};
