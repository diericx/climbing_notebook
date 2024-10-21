import { prisma } from '$lib/server/prisma';
import { TrainingProgramRepo } from '$lib/server/repos/trainingProgram';
import { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export type APITrainingProgramActivationsResponse = (Prisma.TrainingProgramActivationGetPayload<{
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
}> & { startDate: string; endDate: string })[];

export const GET: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session === null) {
    throw error(403);
  }

  const user = session.user;
  const trainingProgramRepo = new TrainingProgramRepo(prisma);

  // TODO: Calculating the end date for an activation takes some computation and is more
  // complex than a trivial query. For now we will fetch all activations.
  const trainingProgramActivations = await trainingProgramRepo.getActivations({
    ownerId: user?.userId,
  });

  return json(trainingProgramActivations);
};
