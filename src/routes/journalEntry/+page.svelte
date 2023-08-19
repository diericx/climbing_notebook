<script lang="ts">
  import Form from '$lib/components/forms/Form.svelte';
  import FormBodyJournalEntry from '$lib/components/forms/bodies/FormBodyJournalEntry.svelte';
  import { journalEntrySchema } from '$lib/journalEntry';
  import { confirmDelete, emptySchema } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="grid grid-cols-1">
  <div>
    <h1>New Journal Entry</h1>
    <hr />

    <Form resetForm={true} schema={journalEntrySchema} action="/journalEntry?/new" let:superForm>
      <FormBodyJournalEntry {superForm} />
    </Form>
  </div>
</div>

<div class="pt-8">
  <h1>Entries</h1>
  <hr />

  <ul class="list">
    {#each data.journalEntries as item}
      <li class="card p-4 mb-4">
        <div>
          <div class="flex w-full justify-between">
            <div>
              <h3 class="font-bold">{new Date(item.date).toLocaleDateString('en-US')}</h3>
            </div>
            <div>
              <a
                class="btn btn-sm variant-ringed"
                href={`/journalEntry/${item.id}/edit?redirectTo=/journalEntry`}
              >
                <Icon icon="material-symbols:edit-outline" height="18" />
                Edit
              </a>
              <Form class="inline" schema={emptySchema} action={`/journalEntry/${item.id}?/delete`}>
                <button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
                  <Icon icon="mdi:trash-outline" height="18" />
                  Delete
                </button>
              </Form>
            </div>
          </div>
          <div class="flex">
            <p class="whitespace-pre-wrap bg-white w-full py-2">{item.content}</p>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>
