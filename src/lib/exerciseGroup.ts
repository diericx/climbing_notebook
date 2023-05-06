import { z } from 'zod';

export const exerciseGroupSchema = z.object({
  name: z.string(),
});
export type ExerciseGroupSchema = typeof exerciseGroupSchema;
