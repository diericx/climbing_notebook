<script lang="ts">
  import { page } from '$app/stores';
  import { superForm, superValidateSync } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import { v4 as uuidv4 } from 'uuid';
  import type { ZodRawShape, z } from 'zod';

  let className = '';

  export let schema: z.ZodObject<ZodRawShape>;
  export let data: any = {};
  export let id: string = uuidv4();
  export let onSuccess: (() => void) | undefined = undefined;
  export let action = '';
  export let resetForm = false;
  export let debug = false;
  export { className as class };
  export let formElement: HTMLFormElement | undefined = undefined;

  // Add redirect data from the page url only if the action doesn't already have a
  // redirect embedded within
  if ($page.url.searchParams.has('redirectTo') && !action.includes('&redirectTo=')) {
    action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
  }

  // Add auth fallback redirect data
  action += '&redirectToAuthFallback=' + $page.url.pathname + $page.url.search;

  // As we are just initializing the form with the provided data, disable errors.
  // Errors will come in after submit either from the server or from client.
  const newSuperForm = superForm(superValidateSync(data, schema, { errors: false }), {
    resetForm,
    applyAction: true,
    invalidateAll: true,
    id,
    dataType: 'json',
    multipleSubmits: 'prevent',
    delayMs: 300,
    timeoutMs: 10000,
    onResult({ result }) {
      if ((result.type == 'success' || result.type == 'redirect') && onSuccess != undefined) {
        onSuccess();
      }
      if (result.type == 'redirect') {
        console.log(result.location);
      }
    },
    onError({ result }) {
      $message = result.error.message;
    },
  });
  const { form, enhance, message } = newSuperForm;
</script>

{#if $message}
  <div class="invalid">{$message}</div>
{/if}

<form bind:this={formElement} method="POST" {action} use:enhance {id} class={`form ${className}`}>
  <input type="hidden" name="_formId" value={id} />
  <slot superForm={newSuperForm} />
</form>

{#if debug}
  <SuperDebug data={$form} />
{/if}
