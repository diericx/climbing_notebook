<script lang="ts">
  import ListItem from '$lib/components/ListItem.svelte';

  import List from '$lib/components/List.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;

  $: trainingPrograms = data.trainingPrograms;
</script>

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
  Training Programs allow you to schedule Training Cycles for any number of weeks.
</p>

<div>
  {#if trainingPrograms.length == 0}
    <p class="text-gray-400 italic">You have no training programs.</p>
  {:else}
    <List>
      {#each trainingPrograms as p}
        <ListItem href={`/trainingProgram/${p.id}/edit`}>
          <div slot="title">
            <div class="text-xl">
              <b>
                {p.name}
              </b>
            </div>
          </div>
          <div slot="popup-buttons">
            <a class="btn btn-sm justify-start" href="/trainingProgram/{p.id}/edit">
              <span> Edit </span>
            </a>
            <FormButton
              action={`/trainingProgram/${p.id}?/delete`}
              class="btn btn-sm w-full justify-start"
              onClick={confirmDelete}
            >
              <span> Delete </span>
            </FormButton>
          </div>
        </ListItem>
      {/each}
    </List>
  {/if}
</div>
