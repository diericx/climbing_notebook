<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  export let action: string;
  let className: string = '';
  export { className as class };
  export let disabled = false;
  export let onClick: ((event: MouseEvent) => void) | undefined = undefined;
  export let onSuccess: (() => void) | undefined = undefined;

  // Add auth fallback redirect data
  action += '&redirectToAuthFallback=' + $page.url.pathname + $page.url.search;
</script>

<form
  {action}
  method="POST"
  class="inline"
  use:enhance={() => {
    return async ({ result, update }) => {
      // `result` is an `ActionResult` object
      if (result.type === 'success') {
        if (onSuccess !== undefined) {
          onSuccess();
        }
      }
      await update();
    };
  }}
>
  <slot name="form" />
  <button class={className} on:click={onClick || undefined} {disabled}>
    <slot />
  </button>
</form>
