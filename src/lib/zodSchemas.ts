import { evaluate } from 'mathjs';
import { z } from 'zod';
import {
  difficulties,
  equipments,
  exerciseEventFieldsToShow,
  exerciseTypes,
  grades,
  gradeSystems,
  localYearMonthDayInUTC,
  muscleGroups,
  muscles,
  postures,
} from './utils';

export const exerciseEventSchema = z.object({
  date: z.date().default(localYearMonthDayInUTC()).nullish(),
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
  dateStart: z.date().default(localYearMonthDayInUTC()),
  dateEnd: z.date().default(localYearMonthDayInUTC()),
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
  fieldsToShow: z
    .enum(exerciseEventFieldsToShow)
    .array()
    .min(1, 'Please select at least one field'),
});
export type ExerciseSchema = typeof exerciseSchema;

export const exerciseGroupSchema = z.object({
  name: z.string().min(1),
});
export type ExerciseGroupSchema = typeof exerciseGroupSchema;

export const fileUploadSchema = z.object({
  file: z.any(),
});
export type FileUploadSchema = typeof fileUploadSchema;

export const journalEntrySchema = z.object({
  date: z.date().default(localYearMonthDayInUTC()),
  content: z.string().min(1, { message: 'Journal entry content is required' }),
  type: z.string().default('climbing'),
  isPublic: z.boolean().default(false),
});
export type JournalEntrySchema = typeof journalEntrySchema;
export const journalEntryPartialSchema = journalEntrySchema.partial();
export type JournalEntryPartialSchema = typeof journalEntryPartialSchema;

export const profileSchema = z.object({
  goals: z.string().optional(),
  imageS3ObjectKey: z.string().nullish(),
  weightUnit: z.string(),
});
export type ProfileSchema = typeof profileSchema;

export const profilePartialSchema = profileSchema.partial();
export type ProfilePartialSchema = typeof profilePartialSchema;

const projectBaseSchema = z.object({
  name: z.string().min(1),
  notes: z.string().nullish(),
  grade: z.string(),
  gradeSystem: z.string(),
  url: z.string().nullish(),
  imageS3ObjectKey: z.string().nullish(),
});
export const projectPartialBaseSchema = projectBaseSchema.partial();

const projectSchemaChecks = (
  val: z.infer<typeof projectBaseSchema> | z.infer<typeof projectPartialBaseSchema>,
  ctx: z.RefinementCtx,
) => {
  if (val.gradeSystem && !gradeSystems.includes(val.gradeSystem)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid grade system`,
      path: ['gradeSystem'],
    });
  }
  if (val.gradeSystem && val.grade && !grades[val.gradeSystem].includes(val.grade)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Grade is required and must be a valid grade for the selected system`,
      path: ['grade'],
    });
  }
};

export const projectSchema = projectBaseSchema.superRefine(projectSchemaChecks);
export type ProjectSchema = typeof projectSchema;

export const projectPartialSchema = projectPartialBaseSchema.superRefine(projectSchemaChecks);
export type ProjectPartialSchema = typeof projectPartialSchema;

export const projectSessionSchema = z.object({
  notes: z.string().nullish(),
  date: z.date().default(localYearMonthDayInUTC()),
  sent: z.boolean().default(false).optional(),
});
export type ProjectSessionSchema = typeof projectSessionSchema;

export const trainingCycleSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish(),
  isPublic: z.boolean().optional().default(false),
});
export const trainingCyclePartialSchema = trainingCycleSchema.partial();
export type TrainingCycleSchema = typeof trainingCycleSchema;
export type TrainingCyclePartialSchema = typeof trainingCyclePartialSchema;

export const trainingCycleTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});
export type TrainingCycleTemplateSchema = typeof trainingCycleTemplateSchema;

export const trainingCycleDaySchema = z.object({
  description: z.string().optional(),
});
export type TrainingCycleDaySchema = typeof trainingCycleDaySchema;

export const trainingProgramSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullish(),
  isPublic: z.boolean().optional().default(false),
});
export const trainingProgramPartialSchema = trainingProgramSchema.partial();
export type TrainingProgramSchema = typeof trainingProgramSchema;
export type TrainingProgramPartialSchema = typeof trainingProgramPartialSchema;

export const trainingProgramScheduledSlotSchema = z.object({
  duration: z.number().min(1, 'Duration must be greater than 0'),
  order: z.number(),
  trainingCycleId: z.number(),
});
export type TrainingProgramScheduledSlotSchema = typeof trainingProgramScheduledSlotSchema;

export const trainingProgramActivationSchema = z.object({
  startDate: z.date().default(localYearMonthDayInUTC()),
  trainingProgramId: z.string(),
});
export type TrainingProgramActivationSchema = typeof trainingProgramActivationSchema;

export const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});
export type RequestPasswordResetSchema = typeof requestPasswordResetSchema;

export const resetPasswordSchema = z.object({
  password: z.string().min(5, { message: 'Password must be at least 5 characters long' }),
  token: z.string(),
});
export type ResetPasswordSchema = typeof resetPasswordSchema;

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(1, { message: 'Username is required' }),
  password: z.string(),
});
export type LoginSchema = typeof loginSchema;

export const signupSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .refine((s) => s.match(/^[0-9a-zA-Z]+$/), {
      message: 'Username must contain only letters or numbers and no spaces.',
    }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters long' }),
});
export type SignupSchema = typeof signupSchema;

export const widgetSchemaBase = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().nullish(),
  width: z.enum(['half', 'full']).default('half'),
  order: z.number(),
  type: z.enum(['chart', 'calendar', 'heatmapCalendar', 'dailyExerciseCalendar']).default('chart'),
  isTemplate: z.boolean(),
  sets: z.number().nullish(),
  reps: z.number().nullish(),
  weight: z.number().nullish(),
  seconds: z.number().nullish(),
  minutes: z.number().nullish(),
  trainingCycleId: z.number().nullish(),
  parentId: z.string().nullish(),
  isPublished: z.boolean().optional(),
});
export const widgetSchemaBasePartial = widgetSchemaBase.partial();

// Split out the refinement function so we can reuse it to compose a partial schema
// below
function refinementFunc(
  val: z.infer<typeof widgetSchemaBase> | z.infer<typeof widgetSchemaBasePartial>,
  ctx: z.RefinementCtx,
) {
  if (val.isTemplate) {
    if (!val.description) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Description is required`,
        path: ['description'],
      });
    }
  }
}
export const widgetSchema = widgetSchemaBase.superRefine(refinementFunc);
export type WidgetSchema = typeof widgetSchema;

export const widgetSchemaPartial = widgetSchemaBasePartial.superRefine(refinementFunc);
export type WidgetSchemaPartial = typeof widgetSchemaPartial;

export const widgetTemplateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});
export type WidgetTemplateSchema = typeof widgetTemplateSchema;

export const datasetSchema = z.object({
  type: z.enum(['line', 'bar']).default('line'),
  color: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
});
export type DatasetSchema = typeof datasetSchema;
