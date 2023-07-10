<script lang="ts">
  import { page } from '$app/stores';
  import { assignDefined } from '$lib/utils';
  import { defaultData, superForm } from 'sveltekit-superforms/client';
  import type { z, ZodRawShape } from 'zod';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let schema: z.ZodObject<ZodRawShape>;
  export let data: any = {};
  export let id: string;
  export let onSuccess: (() => void) | undefined = undefined;
  export let action = '';
  export let resetForm = false;
  export let debug = false;

  // Two way bindings meant to send this info up stream
  export let submitting: boolean;
  export let delayed: boolean;

  // Add redirect data
  if ($page.url.searchParams.has('redirectTo')) {
    action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
  }

  let formData: z.infer<typeof schema> = assignDefined(defaultData(schema), data || {});
  const newSuperForm = superForm(formData, {
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
  const {
    form,
    errors,
    enhance,
    message,
    submitting: _submitting,
    delayed: _delayed,
  } = newSuperForm;

  $: {
    submitting = $_submitting;
    delayed = $_delayed;
  }
</script>

{#if $message}
  <div class="invalid">{$message}</div>
{/if}
<form method="POST" {action} use:enhance {id} class="form">
  <input type="hidden" name="_formId" value={id} />
  <slot form={newSuperForm} formData={$form} errors={$errors} {submitting} {delayed} />
</form>
{#if debug}
  <SuperDebug data={$form} />
{/if}
