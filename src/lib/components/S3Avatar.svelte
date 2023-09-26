<script lang="ts">
  import { Avatar } from '@skeletonlabs/skeleton';

  export let key: string | null | undefined;
  export let s3ObjectUrlPromises: { [key: string]: Promise<string> };
</script>

{#if key === null || key === undefined}
  <Avatar {...$$restProps}>
    <slot />
  </Avatar>
{:else}
  {#await s3ObjectUrlPromises[key]}
    <Avatar {...$$restProps}>
      <slot />
    </Avatar>
  {:then url}
    <Avatar {...$$restProps} src={url}>
      <slot />
    </Avatar>
  {/await}
{/if}
