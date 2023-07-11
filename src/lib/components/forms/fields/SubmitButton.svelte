<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;

  const { delayed, formId } = superForm;
</script>

<button class="relative btn variant-filled mt-2" form={$formId} disabled={$delayed}>
  {#if $delayed}
    <span class="absolute">
      <Icon class="text-xl" icon="line-md:loading-loop" />
    </span>
  {/if}
  <span class={$delayed ? 'invisible' : ''}> Upload </span>
</button>
