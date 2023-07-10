<script lang="ts">
  import ListQueries from '$lib/components/ListQueries.svelte';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  $: queries = data.queries;
</script>

<div class="flex justify-between mb-4">
  <div>
    <h1>Queries</h1>
  </div>
  <div>
    <button
      class="btn btn-sm variant-filled mb-1"
      on:click={() =>
        modalStore.trigger({
          type: 'component',
          component: 'formModalCustomQuery',
          meta: {
            action: `/query?/new`,
            title: 'New Query',
            showOperator: false,
          },
        })}
    >
      <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
      <span>New Query</span>
    </button>
  </div>
</div>

<div>
  <ListQueries {queries} />
</div>
