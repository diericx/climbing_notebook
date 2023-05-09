import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }),
  password: z.string().min(1),
});
export type LoginSchema = typeof loginSchema;

export const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, { message: 'Username is required' }).refine(s => s.match(/^[0-9a-z]+$/), {
    message: 'Username must contain only letters or numbers and no spaces.'
  }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters long' }),
});
export type SignupSchema = typeof signupSchema;
