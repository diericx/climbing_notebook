import { prisma } from '$lib/server/prisma';
import { TrainingProgramRepo } from '$lib/server/repos/trainingProgram';
import { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export type APITrainingProgramActivationsResponse = Prisma.TrainingProgramActivationGetPayload<{
  include: {
    trainingProgram: {
      select: {
        name: true;
        trainingProgramScheduledSlots: {
          select: {
            duration: true;
            trainingCycles: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>[];

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.auth.validate();
  if (session === null) {
    throw error(403);
  }

  const user = session.user;
  const trainingProgramRepo = new TrainingProgramRepo(prisma);

  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');

  if (start == null) {
    throw error(401, 'Must specify start date');
  }
  if (end == null) {
    throw error(401, 'Must specify end date');
  }

  // Workaround for time zone adjustmants made by date... and the fact that
  // date coming from calendar is not full iso string... lame
  const startDate = new Date(start);
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setUTCHours(0, 0, 0, 0);

  const trainingProgramActivations = await trainingProgramRepo.getActivations({
    ownerId: user?.userId,
    where: {
      startDate: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return json(trainingProgramActivations);
};
