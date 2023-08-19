<script lang="ts">
  import CalExerciseEvent from '$lib/components/WeeklyCalendarExerciseEvent.svelte';
  import { daysFromToday, emptySchema, getDayWeekStartsMonday } from '$lib/utils';
  import type { Exercise, Prisma } from '@prisma/client';
  import type { Session } from 'lucia';
  import { onMount } from 'svelte';
  import Form from './forms/Form.svelte';

  type TrainingProgram = Prisma.TrainingProgramGetPayload<{
    include: {
      days: {
        include: {
          exercises: true;
          exerciseGroups: {
            include: {
              exercises: true;
            };
          };
        };
      };
    };
  }>;

  export let trainingProgram: TrainingProgram;
  export let shouldScrollIntoView = false;
  export let disableActionButtons = false;
  export let showMarkedCompleted = true;
  export let showDuplicateBtn = false;
  export let session: Session | null;
  export let exercises: Exercise[];

  onMount(() => {
    if (shouldScrollIntoView) {
      scrollIntoView();
    }
  });

  const todayDayOfTheWeek = getDayWeekStartsMonday(new Date());
  let daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  function scrollIntoView() {
    const el = document.querySelector('#' + daysOfTheWeek[todayDayOfTheWeek]);
    if (!el) return;
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }
</script>

<div class="flex justify-between mb-3 items-end">
  <div>
    <h2 class="font-bold">{trainingProgram.name}</h2>
  </div>

  <div class="flex">
    {#if showDuplicateBtn}
      <div class="mr-2">
        <Form
          schema={emptySchema}
          action={`/trainingProgram/${trainingProgram.id}?/duplicate&redirectTo=/trainingProgram`}
        >
          <button class="btn btn-sm variant-ringed" value="Set Active">
            Duplicate this program
          </button>
        </Form>
      </div>
    {/if}
    {#if session !== null}
      <div>
        <a class="btn btn-sm variant-ringed" href={`/trainingProgram/${trainingProgram.id}/edit`}
          >Edit this program</a
        >
      </div>
    {/if}
  </div>
</div>

<div class="overflow-scroll">
  <div style="width: 1500px">
    <div class="row">
      <div class="grid grid-cols-7">
        {#each trainingProgram.days as day, i}
          <div id={daysOfTheWeek[i].toString()} class="px-2">
            <div
              class="text-center px-2 mb-3 {i == todayDayOfTheWeek
                ? 'border-b-2 border-gray-600'
                : 'border-b border-gray-200'}"
            >
              <p>{daysOfTheWeek[i]}</p>
              <p class="text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis">
                {day.description}&nbsp;
              </p>
            </div>

            <div style="height: 425px;" class="overflow-scroll">
              {#if day.exercises.length == 0 && day.exerciseGroups.length == 0}
                <p class="text-gray-400 italic">No exercises for this day</p>
              {/if}
              {#each day.exercises as exerciseEvent}
                <CalExerciseEvent
                  {exerciseEvent}
                  {exercises}
                  {disableActionButtons}
                  {showMarkedCompleted}
                  date={daysFromToday(i - getDayWeekStartsMonday(new Date()))}
                />
              {/each}

              {#each day.exerciseGroups as group}
                <p class="font-bold">{group.name}</p>
                {#each group.exercises as exerciseEvent}
                  <CalExerciseEvent
                    {disableActionButtons}
                    {exerciseEvent}
                    {exercises}
                    {showMarkedCompleted}
                    date={daysFromToday(i - getDayWeekStartsMonday(new Date()))}
                  />
                {/each}
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
