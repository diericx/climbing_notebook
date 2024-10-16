import { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
import { journalEntrySelects } from '$lib/prismaHelpers/journalEntryHelper';
import { deleteFile, getSignedUrlsAndMetadata, uploadFile } from '$lib/server/aws/s3';
import { prisma } from '$lib/server/prisma';
import { ExerciseEventRepo } from '$lib/server/repos/exerciseEventRepo';
import { JournalEntryRepo } from '$lib/server/repos/journalEntry';
import { MetricRepo } from '$lib/server/repos/metric';
import { ProfileRepo } from '$lib/server/repos/profile';
import { getSessionOrRedirect } from '$lib/utils';
import { fileUploadSchema, profileSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import sharp from 'sharp';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { v4 as uuidv4 } from 'uuid';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const profileRepo = new ProfileRepo(prisma);
  const exerciseEventRepo = new ExerciseEventRepo(prisma);
  const journalEntryRepo = new JournalEntryRepo(prisma);
  const metricsRepo = new MetricRepo(prisma);

  const profile = await profileRepo.getOne(user?.userId);
  const exerciseEvents = await exerciseEventRepo.getManyForUser({
    userId: user?.userId,
    select: exerciseEventSelects.minimal,
  });
  const journalEntries = await journalEntryRepo.getManyForUser({
    userId: user?.userId,
    select: journalEntrySelects.minimal,
  });
  const metrics = await metricsRepo.get(user?.userId);

  const { s3ObjectMetadatas, s3ObjectUrls } = await getSignedUrlsAndMetadata(
    profile.imageS3ObjectKey === null ? [] : [profile.imageS3ObjectKey]
  );

  return {
    profile,
    exerciseEvents,
    journalEntries,
    metrics,
    user,
    s3ObjectMetadatas,
    s3ObjectUrls,
  };
};

export const actions: Actions = {
  edit: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(profileSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProfileRepo(prisma);
    await repo.update(form.data, user?.userId);

    return { form };
  },

  uploadImage: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(fileUploadSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProfileRepo(prisma);
    const profile = await repo.getOneAndValidateOwner(user.userId);

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
      if (profile.imageS3ObjectKey) {
        await deleteFile(profile.imageS3ObjectKey);
      }
      // Upload file
      const fileId = uuidv4();
      const fileSuffix = file.name.split('.').pop();

      // Upload small size
      const key = `profile/${user.userId}/images/${fileId}_48x48.${fileSuffix}`;
      const smallImg = await image.resize(48, 48).toBuffer();

      await uploadFile(key, new File([smallImg as BlobPart], `${fileId}_48x48.${fileSuffix}`), {
        width: imageMetadata.width?.toString() || '0',
        height: imageMetadata.height?.toString() || '0',
      });

      // Update the project
      await repo.update({ imageS3ObjectKey: key }, user?.userId);
    }

    return { form };
  },

  deleteImage: async ({ locals, url, request }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(profileSchema), {
      id: formData.get('_formId')?.toString(),
    });

    const key = formData.get('key');

    if (!key) {
      return fail(401, { message: 'Object Key required' });
    }

    // Delete the file
    await deleteFile(key.toString());

    // Update the project
    const repo = new ProfileRepo(prisma);
    await repo.update({ imageS3ObjectKey: null }, user?.userId);

    return { form };
  },
};
