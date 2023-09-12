<script context="module" lang="ts">
  export function getPageTitle(data: PageData) {
    return data.trainingCycle?.name;
  }
</script>

<script lang="ts">
  import type { PageData } from './$types';

  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
  import { Avatar } from '@skeletonlabs/skeleton';

  export let data: PageData;
  $: trainingCycle = data.trainingCycle;
  $: session = data.session;
</script>

<div class="flex mb-8 items-center">
  <Avatar class="text-white" initials={trainingCycle.owner.username} background="bg-primary-500" />
  <div class="ml-3 align-middle items-center">
    <div class="text-gray-400 text-sm leading-none">Owner</div>
    <div class="leading-none mt-0 font-bold text-xl">{trainingCycle.owner.username}</div>
  </div>
</div>
<div class="flex justify-between mb-3 items-end">
  <div>
    <h1 class="font-bold">{trainingCycle.name}</h1>
  </div>

  <div class="flex">
    {#if session?.user}
      <div>
        <a class="btn btn-sm variant-ringed" href={`/trainingCycle/${trainingCycle.id}/edit`}
          >Edit this cycle</a
        >
      </div>
    {/if}
  </div>
</div>
<WeeklyCalendar
  {trainingCycle}
  shouldScrollIntoView={false}
  disableActionButtons={true}
  showMarkedCompleted={false}
/>
