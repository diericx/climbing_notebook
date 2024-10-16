<script lang="ts" context="module">
  type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import Icon from '@iconify/svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';

  export let superForm: SuperForm<T>;
  export let label = 'Submit';

  const { delayed, formId } = superForm;
</script>

<button class="relative btn variant-filled mt-2" form={$formId} disabled={$delayed} type="submit">
  {#if $delayed}
    <span class="absolute">
      <Icon class="text-xl" icon="line-md:loading-loop" />
    </span>
  {/if}
  <span class={$delayed ? 'invisible' : ''}> {label} </span>
</button>
