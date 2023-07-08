import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ProjectRepo, projectSchema } from '$lib/project';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { writeFileSync } from 'fs';
import { uploadFile } from '$lib/aws/s3';
import { v4 as uuidv4 } from 'uuid';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();
  const repo = new ProjectRepo(prisma);
  let projects;
  try {
    projects = await repo.get(user?.userId);
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    projects,
  };
};

export const actions: Actions = {
  new: async ({ request, url, locals }) => {
    const { user } = await locals.auth.validateUser();
    const formData = await request.formData();
    const form = await superValidate(formData, projectSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    try {
      const newProject = await repo.new(form.data, user?.userId)

      const file = formData.get('file');
      if (file instanceof File) {
        // File type restriction
        if (file.type != 'image/jpeg' && file.type != 'image/png') {
          return setError(form, 'file', 'File type not supported.');
        }
        // Max file size of 5MB
        if (file.size > 1024 * 1024 * 5) {
          return setError(form, 'file', 'File exceeds maximum file size (5MB)');
        }
        // Upload file
        const key = `project/${newProject.id}/images/${uuidv4()}.${file.name.split('.').pop()}`
        await uploadFile(key, file)
        // Update project with file key
        await repo.update({ ...newProject, imageS3ObjectKey: key }, newProject.id, user?.userId)
      }

    } catch (e) {
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
}
