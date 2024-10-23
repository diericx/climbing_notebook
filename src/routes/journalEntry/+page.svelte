<script context="module">
  export const pageTitle = 'Journal';
</script>

<script lang="ts">
  import ListJournalEntry from '$lib/components/ListJournalEntry.svelte';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div>
  <div class="flex justify-between">
    <h1 class="mb-3">Journal</h1>

    <button
      class="btn btn-sm variant-filled mb-2"
      on:click={() =>
        modalStore.trigger({
          type: 'component',
          component: 'formModalJournalEntry',
          meta: {
            action: `/journalEntry?/new`,
            title: 'New Journal Entry',
          },
        })}
    >
      <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
      <span>New Journal Entry</span>
    </button>
  </div>
  <ListJournalEntry journalEntries={data.journalEntries} />
</div>
