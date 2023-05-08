import { z } from 'zod';

export const exerciseGroupSchema = z.object({
  name: z.string().min(1),
});
export type ExerciseGroupSchema = typeof exerciseGroupSchema;
