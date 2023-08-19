<script lang="ts">
  import { confirmDelete, emptySchema } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import type { CustomQuery } from '@prisma/client';
  import Form from './forms/Form.svelte';

  export let queries: CustomQuery[];
</script>

{#if queries.length == 0}
  <span class="italic text-gray-400">No Queries</span>
{:else}
  <ul class="list">
    {#each queries as query}
      <li class="card bg-white py-3 px-2 md:px-4 mb-3">
        <div class="flex items-center md:space-x-3">
          <div class="flex-1 min-w-0">
            <p>{query.name}</p>
            <p class="text-sm text-gray-400">
              {query.table}
            </p>
          </div>
          <div class="flex min-w-0 float-right space-x-2">
            <div>
              <a class="btn btn-sm variant-ringed" href={`/query/${query.id}`}>Show</a>
            </div>
            <Form class="inline" schema={emptySchema} action={`/query/${query.id}?/delete`}>
              <button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
                <Icon icon="mdi:trash-outline" height="18" />
                <span class="ml-1 mr-1"> Delete </span>
              </button>
            </Form>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{/if}
