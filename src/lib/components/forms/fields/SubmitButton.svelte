<script lang="ts">
  import Icon from '@iconify/svelte';

  export let delayed: boolean;
  export let formId: string;
</script>

<button class="relative btn variant-filled mt-2" form={formId} disabled={delayed}>
  {#if delayed}
    <span class="absolute">
      <Icon class="text-xl" icon="line-md:loading-loop" />
    </span>
  {/if}
  <span class={delayed ? 'invisible' : ''}> Upload </span>
</button>
