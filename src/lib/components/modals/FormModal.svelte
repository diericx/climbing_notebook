<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { ZodRawShape, z } from 'zod';
  import Form from '../forms/Form.svelte';
  import SubmitButton from '../forms/fields/SubmitButton.svelte';

  export let schema: z.ZodObject<ZodRawShape>;

  let title = $modalStore[0]?.meta?.title;
  let data = $modalStore[0]?.meta?.data;
  let action = $modalStore[0]?.meta?.action;
  let debug = $modalStore[0]?.meta?.debug;
</script>

<div style="max-height: 90vh" class="card w-modal">
  <header class="card-header">
    <h2 class="font-bold">{title}</h2>
  </header>
  <div style="max-height: 80vh" class="overflow-scroll">
    <Form
      {schema}
      {data}
      {action}
      {debug}
      onSuccess={() => {
        modalStore.close();
      }}
      let:superForm
    >
      <section class="p-4 overflow-scroll">
        <slot {superForm} />
      </section>
      <footer class="card-footer float-right space-x-4">
        <button
          class="btn variant-ghost-surface"
          on:click={(e) => {
            e.preventDefault();
            modalStore.close();
          }}>Cancel</button
        >
        <SubmitButton {superForm} />
      </footer>
    </Form>
  </div>
</div>
