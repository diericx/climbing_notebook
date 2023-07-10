import { z } from 'zod';

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
