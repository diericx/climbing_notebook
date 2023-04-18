import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import { SERVER_ERROR } from "$lib/helperTypes";
import type { Profile } from "@prisma/client";
import { prisma } from "$lib/prisma";
import { ProfileFormData } from "$lib/profile";

export const GET: RequestHandler = async ({ locals }) => {
  const { user } = locals;

  // Fetch
  let profile: Profile;
  try {
    let profiles = await prisma.profile.findMany({
      where: {
        ownerId: Number(user?.userId),
      },
      include: {
        activeTrainingProgram: {
          include: {
            days: {
              include: {
                exercises: true,
                exerciseGroups: {
                  include: {
                    exercises: true,
                  },
                }
              },
              orderBy: {
                // Note: ui depends on this being sorted in this way
                dayOfTheWeek: 'asc',
              },
            },
          }
        }
      }
    }) as Profile[];
    if (profiles.length == 0) {
      return json({ message: "User not found." }, { status: 404 })
    }
    profile = profiles[0]
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ profile }, { status: 200 });
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
  let data = await request.json();
  const { user } = locals;

  // Get form data
  let input = new ProfileFormData(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 401 })
  }

  let result
  try {
    result = await prisma.profile.updateMany({
      data: {
        ...input,
      },
      where: {
        ownerId: Number(user?.userId),
      }
    });
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  if (result.count == 0) {
    return json({ message: "Profile not found" }, { status: 404 })
  }

  return json({ message: "Profile was updated succesfully" }, { status: 200 })
};

