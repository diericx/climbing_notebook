<script lang="ts">
  import { confirmDelete } from '$lib/utils';
  import type { JournalEntry } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';
  import { useQueryClient } from '@sveltestack/svelte-query';
  import FormButton from '../forms/FormButton.svelte';
  const queryClient = useQueryClient();
  const journalEntry = $modalStore[0]?.meta?.data as JournalEntry;
</script>

<div class="card w-modal">
  <header class="card-header">
    <h2 class="font-bold">Journal Entry</h2>
  </header>
  <section class="p-4">
    <h4>
      {journalEntry.date?.toLocaleString(undefined, {
        month: 'numeric',
        year: 'numeric',
        day: 'numeric',
      })}
    </h4>
    <p class="whitespace-pre-wrap">{journalEntry?.content || ''}</p>
  </section>
  <footer class="card-footer float-right space-x-4">
    <button class="btn variant-ghost-surface" on:click={modalStore.close}>Cancel</button>

    <FormButton
      action={`/journalEntry/${journalEntry?.id}?/delete`}
      class="btn variant-filled"
      onSuccess={() => {
        modalStore.clear();
        queryClient.invalidateQueries('exerciseEvents');
      }}
      onClick={confirmDelete}
    >
      <span class="ml-1 mr-1"> Delete </span>
    </FormButton>

    <a href={`/journalEntry/${journalEntry?.id || undefined}/edit?redirectTo=/`}>
      <button class="btn variant-filled" on:click={modalStore.close}>Edit</button>
    </a>
  </footer>
</div>
