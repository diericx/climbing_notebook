<script lang="ts">
  import Widget from '$lib/components/Widget.svelte';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  $: profile = data.profile;
  $: journalEntries = data.journalEntries;
  $: calendarEvents = data.calendarEvents;
  $: widgets = data.widgets;
  $: customQueryResults = data.customQueryResults;
  $: trainingCycles = data.trainingCycles;
</script>

<div class="mb-16">
  <div class="flex justify-between mb-2">
    <h1 class="inline">Your Goals</h1>
  </div>

  <hr />

  <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
    <div class="flex justify-between">
      <div class="flex items-center">
        {#if !profile.goals || profile.goals == ''}
          <p class="text-gray-400">
            You haven't set any goals yet! Edit your <a href={`/profile/edit?redirectTo=/`}
              >Profile</a
            > set some.
          </p>
        {:else}
          {profile.goals}
        {/if}
      </div>
      <div>
        <a class="btn btn-sm variant-ringed" href={`/profile/edit?redirectTo=/`}>
          <Icon icon="material-symbols:edit-outline" height="18" />
          <span>Edit</span>
        </a>
      </div>
    </div>
  </div>
</div>

<div>
  <div class="flex justify-between">
    <div>
      <h1>Dashboard</h1>
    </div>
    <div class="flex space-x-2">
      <button
        class="btn btn-sm variant-ringed mb-1"
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'formModalWidget',
            meta: {
              action: `/widget?/new`,
              title: 'New Widget',
              formProps: {
                trainingCycles: trainingCycles,
              },
            },
          })}
      >
        <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
        <span>New Widget</span>
      </button>
      <div>
        <a href="/widget" class="btn btn-sm variant-filled mb-1">
          <Icon icon="material-symbols:search" height="18" />
          <span>Browse Community Widgets </span>
        </a>
      </div>
    </div>
  </div>
  <hr />

  {#if widgets.length == 0}
    <div class="text-gray-400">
      You don't have any widgets. You can create your own calendar, chart or heatmap widget or you
      can find pre-made widgets in the Community Marketplace.
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    {#each widgets as widget}
      <div class={widget.width == 'full' ? 'md:col-span-2' : 'md:col-span-1'}>
        <Widget
          {widget}
          {customQueryResults}
          {calendarEvents}
          {journalEntries}
          {profile}
          {trainingCycles}
        />
      </div>
    {/each}
  </div>
</div>
