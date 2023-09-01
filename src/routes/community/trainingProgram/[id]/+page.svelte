<script lang="ts">
  import List from '$lib/components/List.svelte';
  import ListItem from '$lib/components/ListItem.svelte';
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import Icon from '@iconify/svelte';
  import { Accordion, AccordionItem, Avatar } from '@skeletonlabs/skeleton';
  import dayjs from 'dayjs';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import type { PageData } from './$types';
  dayjs.extend(localizedFormat);

  export let data: PageData;

  $: trainingProgram = data.trainingProgram;
</script>

<div class="flex justify-between mb-2">
  <h1 class="font-bold">{trainingProgram.name}</h1>

  <FormButton
    action={`/trainingProgram/${trainingProgram.id}?/import&redirectTo=/trainingProgram`}
    class="btn btn-sm variant-filled"
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
    <span>Import Training Program</span>
  </FormButton>
</div>

<div class="mb-2">
  {trainingProgram.description || ''}
</div>

<div class="text-gray-600 flex items-center mb-8">
  <Avatar
    class="text-white"
    width="w-9"
    initials={trainingProgram.owner.username}
    background="bg-primary-500"
  />
  <div class="ml-2 align-middle items-center">
    <div class="text-md leading-none font-bold">{trainingProgram.owner.username}</div>
  </div>
</div>
<div class="mb-12">
  <div>
    {#if trainingProgram.trainingProgramScheduledSlots.length == 0}
      <p class="text-gray-400 italic">No scheduled slots.</p>
    {:else}
      <div class="relative border-l border-gray-200">
        <List>
          {#each trainingProgram.trainingProgramScheduledSlots as s}
            {@const weeks = trainingProgram.trainingProgramScheduledSlots
              .map((_s) => (_s.order < s.order ? _s.duration : 0))
              .reduce((acc, cur) => acc + cur, 0)}
            <div class="ml-3">
              <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"
              />
              <div class="text-gray-300">Week {weeks + 1}</div>
              <ListItem showElipses={false}>
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
                <div slot="title" class="mb-5">
                  <div class="text-xl font-bold">
                    {s.trainingCycles[0].name}
                  </div>
                  {s.duration} week{s.duration == 1 ? '' : 's'}
                </div>
                <div slot="content">
                  <Accordion class="border rounded-lg ">
                    <AccordionItem>
                      <svelte:fragment slot="lead" />
                      <svelte:fragment slot="summary">Show Full Cycle</svelte:fragment>
                      <svelte:fragment slot="content">
                        <WeeklyCalendar trainingCycle={s.trainingCycles[0]} />
                      </svelte:fragment>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ListItem>
            </div>
          {/each}
        </List>
      </div>
    {/if}
  </div>
</div>
