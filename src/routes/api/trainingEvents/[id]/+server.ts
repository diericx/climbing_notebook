import { error, json } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";
import type { RequestHandler } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
const prisma = new PrismaClient();

export const DELETE = (async ({ locals, params }) => {
  let { id } = params;

  // Validate session and get user
  let { user, session } = await locals.validateUser();
  if (!session || session.state !== 'active') {
    throw error(403, { message: "unauthorized" })
  }

  // Validate params
  if (!id || isNaN(Number(id))) {
    throw error(401, { message: "Valid id required" })
  }

  try {
    await prisma.trainingEvent.deleteMany({
      where: {
        id: Number(id),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR })
  }

  return json({}, { status: 200 });
}) satisfies RequestHandler;

