import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma, type TrainingProgramWithDays } from "$lib/prisma";
import type { TrainingProgram } from "@prisma/client";

export const GET: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
  const { user } = locals;
  const { id } = params;

  let trainingProgram: TrainingProgram;
  try {
    let trainingPrograms = await prisma.trainingProgram.findMany({
      where: {
        ownerId: Number(user?.userId),
        id: Number(id),
      },
      include: {
        exerciseGroups: {
          include: {
            exercises: {
              orderBy: {
                name: 'asc',
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        days: {
          include: {
            exercises: {
              orderBy: {
                name: 'asc',
              },
            },
            exerciseGroups: {
              orderBy: {
                name: 'asc',
              },
            },
          },
          orderBy: {
            // Note: ui depends on this being sorted in this way
            dayOfTheWeek: 'asc',
          },
        }
      }
    }) as TrainingProgram[];
    if (trainingPrograms.length == 0) {
      return json({ message: "Training program not found." }, { status: 404 })
    }
    trainingProgram = trainingPrograms[0]
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ trainingProgram }, { status: 200 });
});

export const DELETE: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
  const { id } = params
  const { user } = locals

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 });
  }

  try {
    await prisma.trainingProgram.deleteMany({
      where: {
        id: Number(id),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ message: "Successfuly deleted" }, { status: 200 });
});

export const PATCH: RequestHandler = protectedEndpoint(async ({ locals, request, url, params }) => {
  let data = await request.json();
  const { user } = locals;
  const { id } = params;

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 });
  }

  // Get current data
  let trainingProgram: TrainingProgramWithDays;
  try {
    let trainingPrograms = await prisma.trainingProgram.findMany({
      where: {
        ownerId: Number(user?.userId),
        id: Number(id),
      },
      include: {
        days: true,
      }
    }) as TrainingProgramWithDays[];
    if (trainingPrograms.length == 0) {
      return json({ message: "Training program not found." }, { status: 404 })
    }
    trainingProgram = trainingPrograms[0]
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  // Delete all the exercises on each day
  trainingProgram.days.forEach(async (day) => {
    try {
      await prisma.exerciseEvent.deleteMany({
        where: {
          trainingProgramDayId: Number(day.id),
          ownerId: Number(user?.userId),
        },
      });
    } catch (e) {
      console.error(e);
      return json({ message: SERVER_ERROR }, { status: 500 });
    }
  })

  // Delete all the exercise groups and their exercises
  try {
    await prisma.exerciseGroup.deleteMany({
      where: {
        trainingProgramId: Number(id),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  // Update training program
  try {
    await prisma.trainingProgram.updateMany({
      where: {
        id: Number(id),
        ownerId: Number(user?.userId),
      },
      data: {
        name: data.name,
      },
    });
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  // Create groups with their exercises
  try {
    data.exerciseGroups.forEach(async g => {
      const trainingProgramDayIds = []
      data.days.map(d => {
        if (d.exerciseGroups.find(_g => _g.name == g.name)) {
          trainingProgramDayIds.push(d.id)
        }
      })

      await prisma.exerciseGroup.create({
        data: {
          trainingProgramId: Number(g.trainingProgramId),
          ownerId: Number(user?.userId),
          name: g.name,
          exercises: {
            create: g.exercises.map(e => ({
              name: e.name,
              sets: Number(e.sets),
              reps: Number(e.reps),
              weight: Number(e.weight),
              ownerId: Number(user?.userId)
            }))
          },
          trainingProgramDays: {
            connect: trainingProgramDayIds.map(id => ({
              id,
            }))
          }
        }
      })

    })
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  // Create exercises for each day
  try {
    await prisma.exerciseEvent.createMany({
      data: data.days.map(d => d.exercises.map(e => ({
        name: e.name,
        sets: Number(e.sets),
        reps: Number(e.reps),
        weight: Number(e.weight),
        ownerId: Number(user?.userId),
        trainingProgramDayId: Number(d.id)
      }))).flat(1)
    })
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ message: "Training program was updated succesfully" }, { status: 200 })
});

