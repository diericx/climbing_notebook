import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { auth } from "$lib/server/lucia";
import { isUsernameValid, isPasswordValid } from "$lib/user";
import { Prisma } from "@prisma/client";
import { LuciaError } from "lucia-auth";

export const POST: RequestHandler = async ({ request, locals }) => {
  const { username, password } = await request.json();

  if (!isUsernameValid(username)) {
    throw error(401, { message: "Username cannot be empty" });
  }
  if (!isPasswordValid(password)) {
    throw error(401, { message: "Password cannot be empty" });
  }

  let user
  try {
    user = await auth.createUser("username", username, {
      password,
      attributes: {
        username: username,
      }
    })
  } catch (e) {
    // Catch KNOWN duplicate username/provider id errors from both Lucia and the 
    // propogated Prisma erros.
    if ((e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002' &&
      e.message?.includes('username')) ||
      (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_PROVIDER_ID')
    ) {
      throw error(400, {
        message: "Username already taken"
      })
    }

    // Catch UNKNOWN errors and return 500
    console.error(e);
    throw error(500, {
      message: "An error occured on our end. Please try again later."
    })
  }

  const session = await auth.createSession(user.userId);
  locals.setSession(session);
  return json({});
};
