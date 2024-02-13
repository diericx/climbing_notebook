<script lang="ts">
  import { confirmDelete } from '$lib/utils';

  import FormButton from '$lib/components/forms/FormButton.svelte';

  import type { ZodValidation } from 'sveltekit-superforms';

  import { modalStore } from '@skeletonlabs/skeleton';
  import Form from '../../forms/Form.svelte';
  import SubmitButton from '../../forms/fields/SubmitButton.svelte';

  type T = $$Generic<AnyZodObject>;
  export let schema: ZodValidation<T>;

  let meta = $modalStore[0]?.meta || {};
  const {
    title,
    description,
    action,
    data,
    debug,
    formProps,
    showDeleteButton,
    deleteButtonAction,
  } = meta;
</script>

<div style="max-height: 90vh" class="card w-modal">
  <header class="card-header">
    <h2 class="font-bold">{title}</h2>
    <p class="text-gray-400">{description || ''}</p>
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
        <slot {superForm} formProps={{ ...formProps, data }} />
      </section>
      <footer class="card-footer float-right space-x-4">
        <button
          class="btn variant-ghost-surface"
          on:click={(e) => {
            e.preventDefault();
            modalStore.close();
          }}>Cancel</button
        >
        {#if showDeleteButton}
          <FormButton
            action={deleteButtonAction}
            class="btn variant-filled"
            onSuccess={() => {
              modalStore.clear();
            }}
            onClick={confirmDelete}
          >
            <span class="ml-1 mr-1"> Delete </span>
          </FormButton>
        {/if}
        <slot name="buttons" />
        <SubmitButton {superForm} />
      </footer>
    </Form>
  </div>
</div>
