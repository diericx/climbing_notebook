<script lang="ts">
  import { page } from '$app/stores';
  import { superForm, superValidateSync } from 'sveltekit-superforms/client';
  import type { z, ZodRawShape } from 'zod';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import { v4 as uuidv4 } from 'uuid';

  export let schema: z.ZodObject<ZodRawShape>;
  export let data: any = {};
  export let id: string = uuidv4();
  export let onSuccess: (() => void) | undefined = undefined;
  export let action = '';
  export let resetForm = false;
  export let debug = false;

  // Add redirect data
  if ($page.url.searchParams.has('redirectTo')) {
    action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
  }

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
    },
  });
  const { form, enhance, message, errors } = newSuperForm;
</script>

{#if $message}
  <div class="invalid">{$message}</div>
{/if}

<form method="POST" {action} use:enhance {id} class="form">
  <input type="hidden" name="_formId" value={id} />
  <slot superForm={newSuperForm} />
</form>

{#if debug}
  <SuperDebug data={$form} />
{/if}
