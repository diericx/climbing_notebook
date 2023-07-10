<script>
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormCustomQueryCondition from '../forms/FormCustomQueryCondition.svelte';
  import FormModal from './FormModal.svelte';
  let query = $modalStore[0]?.meta?.query;
</script>

<FormModal let:data let:action let:id>
  <span slot="content">
    <FormCustomQueryCondition
      {data}
      {action}
      {id}
      {query}
      showSubmitButton={false}
      onSuccess={() => {
        modalStore.close();
      }}
    />
  </span>
  <span slot="footer">
    <button class="btn variant-filled" form={id}>Submit</button>
  </span>
</FormModal>
