<script lang="ts">
  import type { PageData } from './$types';

  import ListExerciseEvent from '$lib/components/ListExerciseEvent.svelte';
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
  import {
    getActiveTrainingCycleForTrainingProgramActivation,
    isDateInTheSameDayAsToday,
  } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { Tab, TabGroup, modalStore } from '@skeletonlabs/skeleton';

  export let data: PageData;
  $: activeCycles = data.activeCycles;
  $: validTrainingProgramActivations = data.validTrainingProgramActivations;
  $: exerciseEvents = data.exerciseEvents;
  $: exercises = data.exercises;
  $: profile = data.profile;

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

  interface TabData {
    cycle: (typeof activeCycles)[number];
    program?: (typeof validTrainingProgramActivations)[number]['trainingProgram'];
  }
  $: tabSet = 0;
  $: tabData = [
    ...activeCycles.map((c) => ({
      cycle: c,
    })),
    ...validTrainingProgramActivations.map((a) => ({
      cycle: getActiveTrainingCycleForTrainingProgramActivation(a),
      program: a.trainingProgram,
    })),
  ] as TabData[];
</script>

<div class="mb-14">
  <h1>Active Training Cycles</h1>
  <div>
    {#if activeCycles.length + validTrainingProgramActivations.length == 0}
      <p class="text-gray-400">
        You don't have an active training program or cycle!
        <br />
        You can activate individual week long cycles from the
        <a class="link" href="/trainingCycle"> Training Cycle </a> page.
        <br />
        You can schedule Training Cycles with
        <a class="link" href="/trainingProgram">Training Programs</a>.
      </p>
    {:else}
      <TabGroup>
        <!-- Tabs --->
        {#each tabData as d, i}
          <Tab bind:group={tabSet} name={d.cycle.name} value={i}>
            <span>{d.cycle.name}</span>
          </Tab>
        {/each}
        <!-- Tab Panels --->
        <svelte:fragment slot="panel">
          <div class="flex justify-between mb-3 items-end">
            <div class="flex text-gray-400">
              {#if tabData[tabSet].program !== undefined}
                <p>
                  This cycle was activated from the Training Program
                  <a class="link" href={`/trainingProgram/${tabData[tabSet].program?.id}`}
                    >{tabData[tabSet].program?.name}</a
                  >
                  <br />
                  The Program was activated by your
                  <a class="link" href="/trainingProgramScheduler">Schedule</a>.
                </p>
              {:else}
                <p>
                  This cycle was activated via a direct activation from the
                  <a class="link" href="/trainingCycle">Training Cycles</a> page.
                </p>
              {/if}
            </div>
          </div>
          <WeeklyCalendar {profile} {exercises} trainingCycle={tabData[tabSet].cycle} />
        </svelte:fragment>
      </TabGroup>
    {/if}
  </div>
</div>

<div class="mb-7">
  <div class="flex justify-between">
    <h1>Today</h1>
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
              profile,
            },
          },
        })}
    >
      <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
      <span>New Exercise Event</span>
    </button>
  </div>
  <ListExerciseEvent {profile} exerciseEvents={todaysExerciseEvents} />
</div>

<div class="pt-8">
  <h1 class="mb-3">History</h1>
  <ListExerciseEvent {profile} exerciseEvents={pastExerciseEvents} />
</div>
