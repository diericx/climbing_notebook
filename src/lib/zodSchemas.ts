import { z } from 'zod';

export const exerciseEventSchema = z.object({
  date: z.date().default(new Date()).nullish(),
  name: z.string().nullish().default(''),
  sets: z.number().default(0),
  reps: z.number().default(0),
  weight: z.number().default(0),
  seconds: z.number().default(0),
  minutes: z.number().default(0),
  difficulty: z.number().default(0).nullish(),
  notes: z.string().nullish(),
  trainingCycleDayId: z.number().nullish(),
  exerciseGroupId: z.number().nullish(),
  exerciseId: z.string().min(1, { message: 'Exercise is required' }),
});
export type ExerciseEventSchema = typeof exerciseEventSchema;

export const calendarEventSchema = z.object({
  dateStart: z.date().default(new Date()),
  dateEnd: z.date().default(new Date()),
  title: z.string().min(1).default(''),
  content: z.string().nullish(),
  color: z.string().default('green'),
});
export const calendarEventPartialSchema = calendarEventSchema.partial();
export type CalendarEventSchema = typeof calendarEventSchema;
export type CalendarEventPartialSchema = typeof calendarEventPartialSchema;
