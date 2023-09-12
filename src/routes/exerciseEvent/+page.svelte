<script lang="ts">
  import type { PageData } from './$types';

  import ListExerciseEvent from '$lib/components/ListExerciseEvent.svelte';
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
  import { isDateInTheSameDayAsToday } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';

  export let data: PageData;
  $: activeTrainingCycle = data.profile?.activeTrainingCycle;
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
  <h3>Active Training Cycle</h3>
  <div>
    {#if !activeTrainingCycle}
      <p class="text-gray-400">
        You don't have an active training program or cycle! You can activate individual week long
        cycles from the
        <a class="link" href="/trainingCycle"> Training Cycle </a> page, or you can create a
        <a class="link" href="/trainingProgram">Training Program</a> to schedule multiple week long training
        cycles.
      </p>
    {:else}
      <div class="flex justify-between mb-3 items-end">
        <div>
          <h1 class="font-bold">{activeTrainingCycle.name}</h1>
        </div>

        <div class="flex">
          <div>
            <a
              class="btn btn-sm variant-ringed"
              href={`/trainingCycle/${activeTrainingCycle.id}/edit`}>Edit this program</a
            >
          </div>
        </div>
      </div>
      <WeeklyCalendar {exercises} trainingCycle={activeTrainingCycle} />
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
