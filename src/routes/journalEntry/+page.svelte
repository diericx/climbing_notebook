<script lang="ts">
  import Form from '$lib/components/forms/Form.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import FormBodyJournalEntry from '$lib/components/forms/bodies/FormBodyJournalEntry.svelte';
  import { confirmDelete } from '$lib/utils';
  import { journalEntrySchema } from '$lib/zodSchemas';
  import Icon from '@iconify/svelte';
  import DOMPurify from 'dompurify';
  import { marked } from 'marked';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="grid grid-cols-1 mb-10">
  <div>
    <h1 class="mb-3">New Journal Entry</h1>

    <Form resetForm={true} schema={journalEntrySchema} action="/journalEntry?/new" let:superForm>
      <FormBodyJournalEntry {superForm} />
    </Form>
  </div>
</div>

<div>
  <h1 class="mb-3">Entries</h1>

  <ul class="list space-y-2">
    {#each data.journalEntries as item}
      <li class="card p-4">
        <div>
          <div class="flex w-full justify-between">
            <div>
              <h3 class="font-bold">
                {item.date?.toLocaleString(undefined, {
                  month: 'numeric',
                  year: 'numeric',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </h3>
            </div>
            <div>
              <a
                class="btn btn-sm variant-ringed"
                href={`/journalEntry/${item.id}/edit?redirectTo=/journalEntry`}
              >
                <Icon icon="material-symbols:edit-outline" height="18" />
                <span>Edit</span>
              </a>
              <FormButton
                action={`/journalEntry/${item.id}?/delete`}
                class="btn btn-sm variant-ringed"
                onClick={confirmDelete}
              >
                <Icon icon="mdi:trash-outline" height="18" />
                <span>Delete</span>
              </FormButton>
            </div>
          </div>
          <div class="flex">
            <p class="whitespace-pre-wrap bg-white w-full py-2">
              {#if typeof window !== 'undefined'}
                {@html DOMPurify.sanitize(marked.parse(item.content))}
              {/if}
            </p>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>
