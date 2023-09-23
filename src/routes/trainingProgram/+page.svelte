<script context="module">
  export const pageTitle = 'Programs';
</script>

<script lang="ts">
  import List from '$lib/components/List.svelte';
  import ListItemTrainingProgram from '$lib/components/listItems/ListItemTrainingProgram.svelte';
  import Icon from '@iconify/svelte';
  import { Tab, TabGroup, modalStore } from '@skeletonlabs/skeleton';
  import dayjs from 'dayjs';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import type { PageData } from './$types';

  dayjs.extend(localizedFormat);

  export let data: PageData;

  let tabSet = data.session === null ? 2 : 0;
  $: tabSet;
  $: session = data.session;
  // Ordering by count not supported in prisma...
  $: publicTrainingPrograms = data.publicTrainingPrograms.sort(
    (a, b) => b._count.saves - a._count.saves
  );
  $: savedTrainingPrograms = data.savedTrainingPrograms;
  $: ownedTrainingPrograms = data.ownedTrainingPrograms;
</script>

<div>
  <div>
    <div class="flex justify-between mb-4">
      <h1>Training Programs</h1>
      <div>
        <button
          class="btn btn-sm variant-filled"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalTrainingProgram',
              meta: {
                action: `/trainingProgram?/new`,
                title: 'New Training Program',
              },
            })}
        >
          <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
          <span>New Program</span>
        </button>
      </div>
    </div>

    <p class="mb-8 text-gray-400">
      Training Programs allow you to schedule Training Cycles for multiple weeks. You can view all
      published Cycles from the community in the "Browse" tab. Saved Programs will be available on
      the <a class="link" href="/trainingProgramScheduler">Training Program Scheduler</a> page.
    </p>

    <TabGroup>
      <Tab
        bind:group={tabSet}
        name="tab1"
        value={0}
        disabled={session === null}
        regionTab={session === null ? 'cursor-not-allowed' : undefined}
        hover={session === null ? 'cursor-not-allowed' : undefined}>Created by me</Tab
      >
      <Tab
        bind:group={tabSet}
        name="tab2"
        value={1}
        disabled={session === null}
        regionTab={session === null ? 'cursor-not-allowed' : undefined}
        hover={session === null ? 'cursor-not-allowed' : undefined}>Saved</Tab
      >
      <Tab bind:group={tabSet} name="tab3" value={2}>Browse</Tab>
      <!-- Tab Panels --->
      <svelte:fragment slot="panel">
        {#if tabSet === 0}
          {#if ownedTrainingPrograms.length == 0}
            <p class="text-gray-400 italic">You haven't created any training cycles yet!</p>
          {:else}
            <List>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                {#each ownedTrainingPrograms as trainingProgram}
                  <ListItemTrainingProgram {trainingProgram} {session} showVisibility={true} />
                {/each}
              </div>
            </List>
          {/if}
        {:else if tabSet == 1}
          {#if savedTrainingPrograms.length == 0}
            <p class="text-gray-400 italic">You have no saved training cycles.</p>
          {:else}
            <List>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                {#each savedTrainingPrograms as trainingProgram}
                  <ListItemTrainingProgram
                    {trainingProgram}
                    {session}
                    onSuccessDuplicate={() => (tabSet = 0)}
                  />
                {/each}
              </div>
            </List>
          {/if}
        {:else if tabSet === 2}
          <List>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              {#each publicTrainingPrograms as trainingProgram}
                <ListItemTrainingProgram
                  {trainingProgram}
                  {session}
                  onSuccessDuplicate={() => (tabSet = 0)}
                />
              {/each}
            </div>
          </List>
        {/if}
      </svelte:fragment>
    </TabGroup>

    <div />
  </div>
</div>
