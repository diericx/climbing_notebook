<script lang="ts">
  import type { PageData } from './$types';
  import { modalStore } from '@skeletonlabs/skeleton';
  import Icon from '@iconify/svelte';
  import Widget from '$lib/components/Widget.svelte';

  export let data: PageData;
  $: profile = data.profile;
  $: journalEntries = data.journalEntries;
  $: calendarEvents = data.calendarEvents;
  $: widgets = data.widgets;
  $: customQueryResults = data.customQueryResults;
  $: trainingPrograms = data.trainingPrograms;
</script>

<div class="mb-16">
  <div class="flex justify-between mb-2">
    <h1 class="inline">Your Goals</h1>
    <a class="btn btn-sm variant-ringed" href={`/profile/edit?redirectTo=/`}>
      <Icon icon="material-symbols:edit-outline" height="18" />
      <span>Edit</span>
    </a>
  </div>

  <hr />
  {#if !profile.goals || profile.goals == ''}
    <p class="text-gray-400">
      You haven't set any goals yet! Edit your <a href={`/profile/edit?redirectTo=/`}>Profile</a> set
      some.
    </p>
  {:else}
    <div class="card p-4 whitespace-pre-wrap">
      {profile.goals}
    </div>
  {/if}
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
              trainingPrograms: trainingPrograms,
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

  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    {#each widgets as widget}
      <div class={widget.width == 'full' ? 'col-span-2' : 'col-span-1'}>
        <Widget
          {widget}
          {customQueryResults}
          {calendarEvents}
          {journalEntries}
          {profile}
          {trainingPrograms}
        />
      </div>
    {/each}
  </div>
</div>
