<script lang="ts">
  import type { PageData } from './$types';
  import FormBodyJournalEntry from '$lib/components/forms/bodies/FormBodyJournalEntry.svelte';
  import { confirmDelete } from '$lib/utils';
  import { enhance } from '$app/forms';
  import Icon from '@iconify/svelte';
  import Form from '$lib/components/forms/Form.svelte';
  import { journalEntrySchema } from '$lib/journalEntry';

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
              <form
                method="POST"
                action={`/journalEntry/${item.id}?/delete`}
                class="inline"
                use:enhance
              >
                <button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
                  <Icon icon="mdi:trash-outline" height="18" />
                  Delete
                </button>
              </form>
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
