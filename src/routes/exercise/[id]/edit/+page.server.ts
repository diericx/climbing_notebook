import { APIError } from '$lib/errors';
import { ExerciseRepo, exerciseSchema } from '$lib/exercise';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const exerciseRepo = new ExerciseRepo(prisma);
  try {
    const exercise = await exerciseRepo.getOne(params.id);
    return {
      exercise
    };
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }
};
