import { evaluate } from 'mathjs';
import { z } from 'zod';
import {
  difficulties,
  equipments,
  exerciseEventFieldsToShow,
  exerciseTypes,
  muscleGroups,
  muscles,
  postures,
} from './utils';

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

export const customQuerySchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    table: z.enum(['metric', 'exerciseEvent']).default('exerciseEvent'),
    equation: z.string().min(1, { message: 'Equation is required' }),
    metric: z.string().nullish(),
    exerciseId: z.string().nullish(),
  })
  .superRefine((val, ctx) => {
    if (val.table == 'exerciseEvent' && !val.exerciseId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Exercise is required`,
        path: ['exercise'],
      });
    }
    if (val.table == 'metric' && !val.metric) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Metric is required`,
        path: ['metric'],
      });
    }
    // Check if equation is valid by attempting to solve the equation
    try {
      if (val.table == 'exerciseEvent') {
        evaluate(val.equation, {
          sets: 0,
          reps: 0,
          weight: 0,
          minutes: 0,
          seconds: 0,
        });
      } else if (val.table == 'metric') {
        evaluate(val.equation, {
          value: 0,
        });
      }
    } catch (e: any) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: e.toString(),
        path: ['equation'],
      });
    }
  });
export type CustomQuerySchema = typeof customQuerySchema;

export const customQueryConditionSchema = z
  .object({
    column: z.string().min(1, { message: 'Column is required' }),
    condition: z.enum(['equals', 'contains']).default('contains'),
    useWidgetField: z.boolean().default(false).optional(),
    widgetFieldToUse: z.string().nullish(),
    value: z.number(),
  })
  .superRefine((val, ctx) => {
    // If useWidgetField is set to false, set the widgetFieldToUse to null
    // so that we don't have a potential dangling reference to a field on the
    // widget that may possibly have been removed by another action
    if (val.useWidgetField === false) {
      val.widgetFieldToUse = null;
    }

    if (val.useWidgetField === true && val.widgetFieldToUse === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Must specify a widget field to use',
        path: ['widgetFieldToUse'],
      });
    }
  });
export type CustomQueryConditionSchema = typeof customQueryConditionSchema;

export const exerciseSchema = z.object({
  name: z.string().min(1),
  type: z.enum(exerciseTypes),
  difficulty: z.enum(difficulties).nullish(),
  videoUrl: z.string().nullish(),
  muscleGroup: z.enum(muscleGroups).nullish().default(null),
  primeMoverMuscle: z.enum(muscles).nullish().default(null),
  secondaryMuscle: z.enum(muscles).nullish().default(null),
  tertiaryMuscle: z.enum(muscles).nullish().default(null),
  primaryEquipment: z.enum(equipments).nullish().default(null),
  posture: z.enum(postures).nullish().default(null),
  fieldsToShow: z.array(z.enum(exerciseEventFieldsToShow)).refine((val) => val.length > 0, {
    message: 'At least one field is required',
  }),
});
export type ExerciseSchema = typeof exerciseSchema;
