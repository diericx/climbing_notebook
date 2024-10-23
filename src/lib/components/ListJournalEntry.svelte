<script lang="ts">
  import type { journalEntrySelects } from '$lib/prismaHelpers/journalEntryHelper';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import type { Prisma } from '@prisma/client';
  import { clipboard, modalStore, toastStore } from '@skeletonlabs/skeleton';
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
          <span class="text-gray-500">{journalEntry.isPublic ? 'Public' : ''}</span>
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

        {#if !journalEntry.isPublic}
          <FormButton
            action={`/journalEntry/${journalEntry.id}?/publish`}
            class="btn btn-sm w-full justify-start"
            onSuccess={() => {
              toastStore.trigger({
                message: 'Your Journal Entry is now public and can be shared via public url.',
                timeout: 5000,
              });
            }}
          >
            <Icon icon="material-symbols:share" height="18" />
            <span> Publish </span>
          </FormButton>
        {/if}

        {#if journalEntry.isPublic}
          <FormButton
            action={`/journalEntry/${journalEntry.id}?/hide`}
            class="btn btn-sm w-full justify-start"
            onSuccess={() => {
              toastStore.trigger({
                message: 'Your Journal Entry is now private',
                timeout: 5000,
              });
            }}
          >
            <Icon icon="mdi:hide-outline" height="18" />
            <span> Hide </span>
          </FormButton>
          <div>
            <button
              class="btn btn-sm w-full justify-start"
              use:clipboard={`https://climbingnotebook.com/journalEntry/${journalEntry.id}`}
              on:click={() => {
                toastStore.trigger({
                  message: 'Public URL copied',
                });
              }}
            >
              <Icon icon="ph:link-bold" height="18" />
              <span> Copy Public URL </span>
            </button>
          </div>
        {/if}

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
