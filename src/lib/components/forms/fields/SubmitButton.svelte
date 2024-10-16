<script lang="ts" context="module">
  type T = Record<string, unknown>;
</script>

<script
  lang="ts"
  generics="T extends Record<string, unknown ✂prettier:content✂="
  Ij4KICBpbXBvcnQgSWNvbiBmcm9tICdAaWNvbmlmeS9zdmVsdGUnOwogIGltcG9ydCB0eXBlIHsgU3VwZXJGb3JtIH0gZnJvbSAnc3ZlbHRla2l0LXN1cGVyZm9ybXMvY2xpZW50JzsKCiAgZXhwb3J0IGxldCBzdXBlckZvcm06IFN1cGVyRm9ybTxUPjsKICBleHBvcnQgbGV0IGxhYmVsID0gJ1N1Ym1pdCc7CgogIGNvbnN0IHsgZGVsYXllZCwgZm9ybUlkIH0gPSBzdXBlckZvcm07Cg="=""
></script>

<button class="relative btn variant-filled mt-2" form={$formId} disabled={$delayed} type="submit">
  {#if $delayed}
    <span class="absolute">
      <Icon class="text-xl" icon="line-md:loading-loop" />
    </span>
  {/if}
  <span class={$delayed ? 'invisible' : ''}> {label} </span>
</button>
