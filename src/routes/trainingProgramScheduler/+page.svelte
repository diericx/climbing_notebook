<script lang="ts">
  import Calendar from '$lib/components/Calendar.svelte';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  $: trainingProgramActivations = data.trainingProgramActivations;
  $: ownedTrainingPrograms = data.ownedTrainingPrograms;
  $: savedTrainingPrograms = data.savedTrainingPrograms;
</script>

<div class="flex justify-between mb-4">
  <h1>Training Program Scheduler</h1>
  <div>
    <button
      class="btn btn-sm variant-filled"
      on:click={() =>
        modalStore.trigger({
          type: 'component',
          component: 'formModalTrainingProgramActivation',
          meta: {
            action: `/trainingProgram?/newActivation`,
            title: 'Schedule Program',
            formProps: {
              ownedTrainingPrograms,
              savedTrainingPrograms,
            },
          },
        })}
    >
      <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
      <span>Schedule Program</span>
    </button>
  </div>
</div>

<Calendar
  journalEntries={[]}
  calendarEvents={[]}
  {trainingProgramActivations}
  {ownedTrainingPrograms}
  {savedTrainingPrograms}
/>
