<script lang="ts">
  import type { journalEntrySelects } from '$lib/prismaHelpers/journalEntryHelper';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import type { Prisma } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';
  import DOMPurify from 'dompurify';
  import { marked } from 'marked';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import FormButton from './forms/FormButton.svelte';

  export let journalEntries: Prisma.JournalEntryGetPayload<
    typeof journalEntrySelects.minimalValidator
  >[];
</script>

<List>
  {#each journalEntries as journalEntry}
    <ListItem>
      <div slot="title">
        <div>
          <h3 class="font-bold">
            {journalEntry.date?.toLocaleString(undefined, {
              month: 'numeric',
              year: 'numeric',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </h3>
        </div>
      </div>

      <div slot="content">
        <div>
          <div class="flex">
            <p class="bg-white w-full py-2 font-eb-garamond">
              {#if typeof window !== 'undefined'}
                {@html DOMPurify.sanitize(marked.parse(journalEntry.content))}
              {/if}
            </p>
          </div>
        </div>
      </div>

      <div slot="popup-buttons">
        <button
          class="btn btn-sm w-full justify-start"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalJournalEntry',
              meta: {
                data: journalEntry,
                action: `/journalEntry/${journalEntry.id}?/edit`,
                title: 'Edit Journal Entry',
              },
            })}
        >
          <Icon icon="material-symbols:edit-outline" height="18" />
          <span>Edit</span>
        </button>
        <div />
        <FormButton
          action={`/journalEntry/${journalEntry.id}?/delete`}
          class="btn btn-sm w-full justify-start"
          onClick={confirmDelete}
        >
          <Icon icon="mdi:trash-outline" height="18" />
          <span class="ml-1 mr-1"> Delete </span>
        </FormButton>
      </div>
    </ListItem>
  {/each}
</List>

{#if journalEntries.length == 0}
  <span class="italic text-gray-400">No Journal Entries</span>
{/if}
