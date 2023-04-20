import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { isUsernameValid, isPasswordValid, isEmailValid } from '$lib/user';
import { Prisma, type Profile } from '@prisma/client';
import { LuciaError } from 'lucia-auth';
import { prisma } from '$lib/prisma';
import { SERVER_ERROR } from '$lib/helperTypes';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { username, password, email } = await request.json();

  if (!isUsernameValid(username)) {
    return json({ message: 'Username cannot be empty' }, { status: 401 })
  }
  if (!isPasswordValid(password)) {
    return json({ message: 'Password cannot be empty' }, { status: 401 })
  }
  if (!isEmailValid(email)) {
    return json({ message: 'Email must be valid' }, { status: 401 })
  }

  let user
  try {
    user = await auth.createUser('username', username, {
      password,
      attributes: {
        email: email,
        username: username,
      }
    })
  } catch (e) {
    // Catch KNOWN duplicate username/provider id errors from both Lucia and the 
    // propogated Prisma erros.
    if ((e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) ||
      (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_PROVIDER_ID')
    ) {
      return json({ message: 'Username or email already taken' }, { status: 400 })
    }

    // Catch UNKNOWN errors and return 500
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  try {
    await prisma.profile.create({
      data: {
        goals: '',
        ownerId: Number(user?.userId),
        createdAt: new Date(),
      },
    }) as Profile;
  } catch (e) {
    // Catch UNKNOWN errors and return 500
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  const session = await auth.createSession(user.userId);
  locals.setSession(session);
  return json({});
};
