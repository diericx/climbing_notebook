<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { CustomQuery } from '@prisma/client';
  import FormButton from './forms/FormButton.svelte';

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
            <FormButton action={`/query/${query.id}?/delete`} class="btn btn-sm variant-ringed">
              <Icon icon="mdi:trash-outline" height="18" />
              <span class="ml-1 mr-1"> Delete </span>
            </FormButton>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{/if}
