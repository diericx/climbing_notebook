import { z } from 'zod';

export const trainingProgramDaySchema = z.object({
  description: z.string(),
});
export type TrainingProgramDaySchema = typeof trainingProgramDaySchema;
