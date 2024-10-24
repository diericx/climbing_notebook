import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { journalEntrySelects } from '$lib/prismaHelpers/journalEntryHelper';
import { prisma } from '$lib/server/prisma';
import { JournalEntryRepo } from '$lib/server/repos/journalEntry';
import { getSessionOrRedirect } from '$lib/utils';
import { journalEntrySchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const repo = new JournalEntryRepo(prisma);
  const journalEntries = await repo.getManyForUser({
    userId: user?.userId,
    select: journalEntrySelects.minimal,
  });

  return {
    journalEntries,
  };
};

export const actions: Actions = {
  new: async ({ request, url, locals }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(journalEntrySchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new JournalEntryRepo(prisma);
    try {
      await repo.new(form.data, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        if (e.message == 'UNIQUENESS_COLLISION') {
          form.message = 'Journal entry for that date already exists';
          return fail(401, { form });
        }
      }
      console.error(e);
      return fail(500, { message: SERVER_ERROR });
    }

    return { form };
  },
};
