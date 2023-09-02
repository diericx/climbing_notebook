<script lang="ts">
  import { page } from '$app/stores';
  import type { Crumb, CrumbConfig } from '$lib/utils';

  $: crumbConfig = { crumbs: [] } as CrumbConfig;
  $: {
    // Cannot subscribe to 'page' store on the server outside of a Svelte
    if ($page.data.crumbConfig) {
      // Pages can specify their own breadcrumb completely, overriding the breadcrumb
      // generation logic
      crumbConfig = $page.data.crumConfig;
    } else if ($page.route.id) {
      // The next best case would be to parse the source route and import the
      // page titles from each page.
      crumbConfig = {
        crumbs: [],
      };
      let totalPath = '';
      let totalRoute = '';
      const routes = $page.route.id.split('/').filter((p) => p != '');
      const paths = $page.url.pathname.split('/').filter((p) => p != '');
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let route = routes[i];
        totalPath += `/${path}`;
        // For some reason the import doesn't like adding the slash here...
        totalRoute += `${route}`;

        // Setup the crumb
        let crumb: Crumb = {
          // Only set url if it is not the last one
          url: i == paths.length - 1 ? undefined : totalPath,
          route: '../../routes/' + totalRoute + '/+page.svelte',
          title: path.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
        };

        crumbConfig.crumbs = [...crumbConfig.crumbs, crumb];
        totalRoute += '/';
      }
    } else {
      let totalPath = '';
      const paths = $page.url.pathname.split('/').filter((p) => p != '');
      crumbConfig = {
        crumbs: [],
      };
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        totalPath += `/${path}`;
        crumbConfig.crumbs.push({
          title: path,
          url: i == paths.length - 1 ? undefined : totalPath,
        });
      }
    }
  }
</script>

{#if crumbConfig}
  <ol class="breadcrumb">
    <li class="crumb"><a class="anchor" href="/">Home</a></li>
    {#each crumbConfig.crumbs as c}
      <li class="crumb-separator" aria-hidden>/</li>
      <li class={`${c.url ? 'crumb' : ''}`}>
        <a class={`${c.url ? 'anchor' : ''}`} href={c.url}>
          {#if c.route}
            {#await import(c.route) then result}
              {#if result.pageTitle}
                {result.pageTitle}
              {:else}
                {c.title}
              {/if}
            {:catch error}
              {console.error(error)}
              {c.title}
            {/await}
          {:else}
            {c.title}
          {/if}
        </a>
      </li>
    {/each}
  </ol>
{/if}
