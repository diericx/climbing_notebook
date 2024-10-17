import { deleteFile, getSignedUrlsAndMetadata, uploadFile } from '$lib/server/aws/s3';
import { prisma } from '$lib/server/prisma';
import { ProjectRepo } from '$lib/server/repos/project';
import { getSessionOrRedirect } from '$lib/utils';
import { fileUploadSchema, projectPartialSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import sharp from 'sharp';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { v4 as uuidv4 } from 'uuid';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const repo = new ProjectRepo(prisma);
  const project = await repo.getOneAndValidateOwner(params.id, user?.userId);

  const { s3ObjectMetadatas, s3ObjectUrls } = await getSignedUrlsAndMetadata(
    project.imageS3ObjectKey === null ? [] : [project.imageS3ObjectKey],
  );

  return {
    project,
    s3ObjectUrls,
    s3ObjectMetadatas,
  };
};

export const actions: Actions = {
  delete: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = params.id;

    const repo = new ProjectRepo(prisma);
    const project = await repo.getOneAndValidateOwner(id, user?.userId);
    // Delete any attached files
    if (project.imageS3ObjectKey) {
      await deleteFile(project.imageS3ObjectKey);
    }
    // Delete the resource
    await repo.delete(id, user?.userId);

    return { success: true };
  },

  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const id = params.id;
    const form = await superValidate(formData, zod(projectPartialSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    await repo.update(form.data, id, user?.userId);

    return { form };
  },

  uploadImage: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const id = params.id;
    const form = await superValidate(formData, zod(fileUploadSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
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

    return { form };
  },

  deleteImage: async ({ locals, url, params, request }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(projectPartialSchema), {
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
    await repo.update({ imageS3ObjectKey: null }, id, user?.userId);

    return { form };
  },
};
