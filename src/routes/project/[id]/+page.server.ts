import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { SERVER_ERROR } from '$lib/helperTypes';
import { projectPartialSchema, ProjectRepo } from '$lib/project';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { APIError } from '$lib/errors';
import { deleteFile, getMetadata, getPresignedUrl, uploadFile } from '$lib/aws/s3';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { fileUploadSchema } from '$lib/file';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validate();
  const repo = new ProjectRepo(prisma);
  try {
    const project = await repo.getOneAndValidateOwner(params.id, user?.userId);
    // NOTE: we should create some sort of helper function for fetching batches of s3 object urls
    // once it is used more often that returns an object of this signature.
    const s3ObjectUrls: { [key: string]: string } = {};
    if (project.imageS3ObjectKey) {
      s3ObjectUrls[project.imageS3ObjectKey] = await getPresignedUrl(project.imageS3ObjectKey);
    }
    const s3ObjectMetadatas: { [key: string]: Record<string, string> | undefined } = {};
    if (project.imageS3ObjectKey) {
      s3ObjectMetadatas[project.imageS3ObjectKey] = await getMetadata(project.imageS3ObjectKey);
    }

    return {
      project,
      s3ObjectUrls,
      s3ObjectMetadatas,
    };
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};

export const actions: Actions = {
  delete: async ({ locals, url, params }) => {
    const { user } = await locals.auth.validate();
    const id = params.id;

    const repo = new ProjectRepo(prisma);
    try {
      const project = await repo.getOneAndValidateOwner(id, user?.userId);
      // Delete any attached files
      if (project.imageS3ObjectKey) {
        await deleteFile(project.imageS3ObjectKey);
      }
      // Delete the resource
      await repo.delete(id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  edit: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validate();
    const id = params.id;
    const form = await superValidate(formData, projectPartialSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    try {
      await repo.update(form.data, id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },

  uploadImage: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validate();
    const id = params.id;
    const form = await superValidate(formData, fileUploadSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    try {
      const project = await repo.getOneAndValidateOwner(id, user?.userId);

      const file = formData.get('file');
      if (file instanceof File) {
        // File is required
        if (file.size == 0) {
          return setError(form, 'file', 'No file was selected to upload');
        }
        // File type restriction
        if (file.type != 'image/jpeg' && file.type != 'image/png') {
          return setError(form, 'file', 'File type not supported.');
        }

        const image = sharp(Buffer.from(await file.arrayBuffer()));
        const imageMetadata = await image.metadata();
        // Max file size of 5MB
        if (file.size > 1024 * 1024 * 5) {
          return setError(form, 'file', 'File exceeds maximum file size (5MB)');
        }
        // Delete existing file if it exists
        if (project.imageS3ObjectKey) {
          await deleteFile(project.imageS3ObjectKey);
        }
        // Upload file
        const key = `project/${project.id}/images/${uuidv4()}.${file.name.split('.').pop()}`;
        await uploadFile(key, file, {
          width: imageMetadata.width?.toString() || '0',
          height: imageMetadata.height?.toString() || '0',
        });

        // Update the project
        await repo.update({ imageS3ObjectKey: key }, id, user?.userId);
      }
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },

  deleteImage: async ({ locals, url, params, request }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validate();
    const form = await superValidate(formData, projectPartialSchema, {
      id: formData.get('_formId')?.toString(),
    });

    const id = params.id;
    const key = formData.get('key');

    if (!key) {
      return fail(401, { message: 'Object Key required' });
    }

    // Delete the file
    await deleteFile(key.toString());

    // Update the project
    const repo = new ProjectRepo(prisma);
    try {
      await repo.update({ imageS3ObjectKey: null }, id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
