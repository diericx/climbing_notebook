<script context="module">
  export const pageTitle = 'Training Cycles';
</script>

<script lang="ts">
  import List from '$lib/components/List.svelte';
  import ListItemTrainingCycle from '$lib/components/listItems/ListItemTrainingCycle.svelte';
  import Icon from '@iconify/svelte';
  import { Tab, TabGroup, modalStore } from '@skeletonlabs/skeleton';
  import dayjs from 'dayjs';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import type { PageData } from './$types';

  dayjs.extend(localizedFormat);

  export let data: PageData;

  let tabSet: number = 0;

  $: session = data.session;
  // Ordering by count not supported in prisma...
  $: publicTrainingCycles = data.publicTrainingCycles.sort(
    (a, b) => b._count.saves - a._count.saves
  );
  // We only query for saves related to the current user, so length check will be fine
  $: savedTrainingCycles = data.savedTrainingCycles;
  $: ownedTrainingCycles = data.ownedTrainingCycles;
</script>

<div>
  <div>
    <div class="flex justify-between mb-4">
      <h1>Training Cycles</h1>
      <div>
        <button
          class="btn btn-sm variant-filled"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalTrainingCycle',
              meta: {
                action: `/trainingCycle?/new`,
                title: 'New Training Cycle',
              },
            })}
        >
          <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
          <span>New Cycle</span>
        </button>
      </div>
    </div>

    <p class="mb-8 text-gray-400">
      Training Cycles are one week long exercise plans. Training Cycles that you have created or
      starred will be available to all of your <a class="link" href="/trainingProgram"
        >Training Programs</a
      > and widgets. You can also view all published Cycles from the community.
    </p>

    <TabGroup>
      <Tab bind:group={tabSet} name="tab1" value={0}>Created by me</Tab>
      <Tab bind:group={tabSet} name="tab2" value={1}>Saved</Tab>
      <Tab bind:group={tabSet} name="tab3" value={2}>Browse</Tab>
      <!-- Tab Panels --->
      <svelte:fragment slot="panel">
        {#if tabSet === 0}
          {#if ownedTrainingCycles.length == 0}
            <p class="text-gray-400 italic">You haven't created any training cycles yet!</p>
          {:else}
            <List>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                {#each ownedTrainingCycles as trainingCycle}
                  <ListItemTrainingCycle {trainingCycle} {session} showVisibility={true} />
                {/each}
              </div>
            </List>
          {/if}
        {:else if tabSet == 1}
          {#if savedTrainingCycles.length == 0}
            <p class="text-gray-400 italic">You have no saved training cycles.</p>
          {:else}
            <List>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                {#each savedTrainingCycles as trainingCycle}
                  <ListItemTrainingCycle {trainingCycle} {session} />
                {/each}
              </div>
            </List>
          {/if}
        {:else if tabSet === 2}
          <List>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              {#each publicTrainingCycles as trainingCycle}
                <ListItemTrainingCycle {trainingCycle} {session} />
              {/each}
            </div>
          </List>
        {/if}
      </svelte:fragment>
    </TabGroup>

    <div />
  </div>
</div>
