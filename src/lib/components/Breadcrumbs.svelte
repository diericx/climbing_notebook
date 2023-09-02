<script lang="ts">
  import { page } from '$app/stores';
  import type { Crumb } from '$lib/utils';

  export let relPathToRoutes = '';

  let crumbs: Crumb[] = [];
  $: {
    crumbs = [];
    // Cannot subscribe to 'page' store on the server outside of a Svelte
    if ($page.data.crumbs) {
      // Pages can specify their own breadcrumb completely, overriding the breadcrumb
      // generation logic
      crumbs = $page.data.crumbs;
    } else if ($page.route.id) {
      // The next best case would be to parse the source route and import the
      // page titles from each page.
      let completeUrl = '';
      let completeRoute = '';
      const routes = $page.route.id.split('/').filter((p) => p != '');
      const paths = $page.url.pathname.split('/').filter((p) => p != '');
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let route = routes[i];
        completeUrl += `/${path}`;
        // For some reason the import doesn't like adding the slash here...
        completeRoute += `${route}`;

        // Setup the crumb
        let crumb: Crumb = {
          // Only set url if it is not the last one
          url: i == paths.length - 1 ? undefined : completeUrl,
          route:
            relPathToRoutes +
            (relPathToRoutes.slice(-1) == '/' ? '' : '/') +
            completeRoute +
            '/+page.svelte',
          title: path.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
        };

        completeRoute += '/';
        crumbs.push(crumb);
      }

      // Force trigger an update
      crumbs = [...crumbs];
    } else {
      let completeUrl = '';
      const paths = $page.url.pathname.split('/').filter((p) => p != '');
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        completeUrl += `/${path}`;
        crumbs.push({
          title: path,
          url: i == paths.length - 1 ? undefined : completeUrl,
        });
      }

      crumbs = [...crumbs];
    }
  }
</script>

<slot {crumbs} />
