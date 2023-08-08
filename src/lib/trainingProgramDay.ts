import { z } from 'zod';

export const trainingProgramDaySchema = z.object({
  description: z.string().optional(),
});
export type TrainingProgramDaySchema = typeof trainingProgramDaySchema;
