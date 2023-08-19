<script lang="ts">
  import { confirmDelete, emptySchema } from '$lib/utils';
  import type { CalendarEvent } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';
  import Form from '../forms/Form.svelte';
  let calendarEvent = $modalStore[0]?.meta?.data as CalendarEvent;
</script>

<div class="card w-modal">
  <header class="card-header">
    <h2 class="font-bold">Event</h2>
  </header>
  <section class="p-4">
    <h4>
      {new Date(calendarEvent?.dateStart || '').toLocaleDateString('en-US') || ''}
    </h4>
    <h4>{calendarEvent.title}</h4>
    {#if calendarEvent?.content}
      <p class="whitespace-pre-wrap">{calendarEvent?.content}</p>
    {:else}
      <p class="italic text-gray-400">No content</p>
    {/if}
  </section>
  <footer class="card-footer flex float-right space-x-4">
    <button class="btn variant-ghost-surface" on:click={modalStore.close}>Cancel</button>

    <Form
      schema={emptySchema}
      action={`/calendarEvent/${calendarEvent.id}?/delete`}
      onSuccess={() => {
        modalStore.clear();
      }}
    >
      <button on:click={confirmDelete} class="btn variant-filled">
        <span class="ml-1 mr-1"> Delete </span>
      </button>
    </Form>
    <a href={`/calendarEvent/${calendarEvent?.id || undefined}/edit?redirectTo=/`}>
      <button class="btn variant-filled" on:click={modalStore.close}>Edit</button>
    </a>
  </footer>
</div>
