<script lang="ts">
  import type { TrainingProgramRepo } from '$lib/trainingProgram';
  import type { Prisma } from '@prisma/client';
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import WeeklyCalendar from './WeeklyCalendar.svelte';

  export let trainingProgram: Prisma.TrainingProgramGetPayload<
    typeof TrainingProgramRepo.selectEverythingValidator
  >;
</script>

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
              <ListItem showElipses={false} class="px-0 py-0">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
                <div slot="content">
                  <Accordion padding="p-4">
                    <AccordionItem>
                      <svelte:fragment slot="lead" />
                      <svelte:fragment slot="summary">
                        <div slot="title">
                          <div class="text-xl font-bold">
                            {s.trainingCycles[0].name}
                          </div>
                          <div class="text-gray-400">
                            {s.trainingCycles[0].description || ''}
                          </div>
                          {s.duration} week{s.duration == 1 ? '' : 's'}
                        </div>
                      </svelte:fragment>
                      <svelte:fragment slot="content">
                        <WeeklyCalendar trainingCycle={s.trainingCycles[0]} height="350px" />
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
