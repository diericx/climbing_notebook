import { z } from 'zod';

export const fileUploadSchema = z.object({
  file: z.any(),
});
export type FileUploadSchema = typeof fileUploadSchema;
