<script context="module">
  export const pageTitle = 'Cycles';
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import List from '$lib/components/List.svelte';
  import ListItemTrainingCycle from '$lib/components/listItems/ListItemTrainingCycle.svelte';
  import Icon from '@iconify/svelte';
  import { Tab, TabGroup, modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;

  // Enable setting initial tab from url
  const tabFromUrl = Number($page.url.searchParams.get('tab'));

  let tabSet = data.session === null ? 2 : tabFromUrl || 0;
  $: tabSet;
  $: session = data.session;
  // Ordering by count not supported in prisma...
  $: publicTrainingCycles = data.publicTrainingCycles.sort(
    (a, b) => b._count.saves - a._count.saves
  );
  $: savedTrainingCycles = data.savedTrainingCycles;
  $: ownedTrainingCycles = data.ownedTrainingCycles;
  const { s3ObjectUrlPromises } = data;
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
      saved will be available to all of your <a class="link" href="/trainingProgram"
        >Training Programs</a
      > and widgets. You can also view all published Cycles from the community in the Browse tab.
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
          {#if ownedTrainingCycles.length == 0}
            <p class="text-gray-400 italic">You haven't created any training cycles yet!</p>
          {:else}
            <List>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                {#each ownedTrainingCycles as trainingCycle}
                  <ListItemTrainingCycle
                    {s3ObjectUrlPromises}
                    {trainingCycle}
                    {session}
                    showVisibility={true}
                  />
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
                  <ListItemTrainingCycle
                    {s3ObjectUrlPromises}
                    {trainingCycle}
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
              {#each publicTrainingCycles as trainingCycle}
                <ListItemTrainingCycle
                  {s3ObjectUrlPromises}
                  {trainingCycle}
                  {session}
                  onSuccessDuplicate={() => {
                    tabSet = 0;
                  }}
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
