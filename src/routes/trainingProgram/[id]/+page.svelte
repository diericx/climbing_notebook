<script lang="ts">
  import type { PageData } from './$types';
  import { Avatar } from '@skeletonlabs/skeleton';
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';

  export let data: PageData;
  $: trainingProgram = data.trainingProgram;
  $: session = data.session;
</script>

<div class="flex mb-8 items-center">
  <Avatar
    class="text-white"
    initials={trainingProgram.owner.username}
    background="bg-primary-500"
  />
  <div class="ml-3 align-middle items-center">
    <div class="text-gray-400 text-sm leading-none">Owner</div>
    <div class="leading-none mt-0 font-bold text-xl">{trainingProgram.owner.username}</div>
  </div>
</div>
<WeeklyCalendar
  {session}
  {trainingProgram}
  shouldScrollIntoView={false}
  disableActionButtons={true}
  showMarkedCompleted={false}
/>
