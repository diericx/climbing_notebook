<script lang="ts">
  import CalExerciseEvent from '$lib/components/WeeklyCalendarExerciseEvent.svelte';
  import type { exerciseSelects } from '$lib/prismaHelpers/exerciseHelper';
  import type { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
  import { daysFromToday, getDayWhenWeekStartsMonday } from '$lib/utils';
  import type { Prisma } from '@prisma/client';
  import { onMount } from 'svelte';

  // This is a public facing component so the profile may not exist
  export let profile: Prisma.ProfileGetPayload<{ select: { weightUnit: true } }> | null;
  export let trainingCycle: Prisma.TrainingCycleGetPayload<
    typeof trainingCycleSelects.everythingValidator
  >;
  export let shouldScrollIntoView = false;
  export let disableActionButtons = false;
  export let showMarkedCompleted = true;
  export let exercises:
    | Prisma.ExerciseGetPayload<typeof exerciseSelects.minimalValidator>[]
    | undefined = undefined;
  export let height = '425px;';

  onMount(() => {
    if (shouldScrollIntoView) {
      scrollIntoView();
    }
  });

  const todayDayOfTheWeek = getDayWhenWeekStartsMonday(new Date());
  const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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

<div class="overflow-scroll">
  <div style="width: 1500px">
    <div class="row">
      <div class="grid grid-cols-7">
        {#each trainingCycle.days as day, i}
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

            <div style={`height: ${height}`} class="overflow-scroll">
              {#if day.exercises.length == 0 && day.exerciseGroups.length == 0}
                <p class="text-gray-400 italic">No exercises for this day</p>
              {/if}
              {#each day.exercises as exerciseEvent}
                <CalExerciseEvent
                  {profile}
                  {exerciseEvent}
                  {exercises}
                  {disableActionButtons}
                  {showMarkedCompleted}
                  date={daysFromToday(i - getDayWhenWeekStartsMonday(new Date()))}
                />
              {/each}

              {#each day.exerciseGroups as group}
                <p class="font-bold">{group.name}</p>
                {#each group.exercises as exerciseEvent}
                  <CalExerciseEvent
                    {profile}
                    {disableActionButtons}
                    {exerciseEvent}
                    {exercises}
                    {showMarkedCompleted}
                    date={daysFromToday(i - getDayWhenWeekStartsMonday(new Date()))}
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
