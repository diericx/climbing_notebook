<script lang="ts">
  import { page } from '$app/stores';
  import type { Crumb } from '$lib/utils';

  export let crumb: Crumb;
  const routeModules = import.meta.glob('../../routes/**/*.svelte');

  function logError(e: any) {
    console.error(e);
    return '';
  }

  function importModule(path: string): any {
    return routeModules[path]();
  }
</script>

{#if crumb.route}
  {#await importModule(crumb.route) then result}
    {#if result.title}
      {result.title}
    {:else if result.getPageTitle}
      {result.getPageTitle($page)}
    {:else}
      {crumb.title}
    {/if}
  {:catch error}
    {logError(error)}
    {crumb.title}
  {/await}
{:else}
  {crumb.title}
{/if}
