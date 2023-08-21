import { z } from 'zod';

export const trainingCycleDaySchema = z.object({
  description: z.string().optional(),
});
export type TrainingCycleDaySchema = typeof trainingCycleDaySchema;
