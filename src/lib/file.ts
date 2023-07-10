import { z } from 'zod';

export const fileUploadSchema = z.object({
  files: z.any(),
});
export type FileUploadSchema = typeof fileUploadSchema;
