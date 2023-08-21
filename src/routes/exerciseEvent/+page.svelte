<script lang="ts">
  import type { PageData } from './$types';

  import ListExerciseEvent from '$lib/components/ListExerciseEvent.svelte';
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
  import { isDateInTheSameDayAsToday } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';

  export let data: PageData;
  $: activeTrainingProgram = data.profile?.activeTrainingProgram;
  $: exerciseEvents = data.exerciseEvents;
  $: user = data.user;
  $: exercises = data.exercises;

  // Filter out only todays exercise events
  $: todaysExerciseEvents = exerciseEvents.filter((e) => {
    if (e.date == undefined) {
      return false;
    }
    return isDateInTheSameDayAsToday(e.date);
  });

  // Filter out only exercise events that aren't today
  $: pastExerciseEvents = exerciseEvents.filter((e) => {
    if (!e.date) {
      return false;
    }
    const [todayStr] = new Date().toISOString().split('T');
    const [eDateStr] = e.date.toISOString().split('T');
    return eDateStr != todayStr;
  });
</script>

<div class="mb-14">
  <h3>Active Training Program</h3>
  <div>
    {#if !activeTrainingProgram}
      <p class="text-gray-400">
        You don't have an active training program! Go to the <a class="link" href="/trainingProgram"
          >Training Programs</a
        > page to create and set one.
      </p>
    {:else}
      <WeeklyCalendar
        {exercises}
        {user}
        trainingProgram={activeTrainingProgram}
        showDuplicateBtn={false}
      />
    {/if}
  </div>
</div>

<div class="mb-7">
  <div class="flex justify-between">
    <h2>Today</h2>
    <button
      class="btn btn-sm variant-filled mb-2"
      on:click={() =>
        modalStore.trigger({
          type: 'component',
          component: 'formModalExerciseEvent',
          meta: {
            action: `/exerciseEvent?/new`,
            title: 'New Exercise Event',
            formProps: {
              showMigrationOption: false,
              exercises,
            },
          },
        })}
    >
      <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
      <span>New Exercise Event</span>
    </button>
  </div>
  <ListExerciseEvent {exercises} exerciseEvents={todaysExerciseEvents} />
</div>

<div class="pt-8">
  <h2 class="mb-3">History</h2>
  <ListExerciseEvent {exercises} exerciseEvents={pastExerciseEvents} />
</div>
