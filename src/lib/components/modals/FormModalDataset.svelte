<script>
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormDataset from '../forms/FormDataset.svelte';
  import FormModal from './FormModal.svelte';
  let customQueries = $modalStore[0]?.meta?.customQueries;
  let showColor = $modalStore[0]?.meta?.showColor;
  let showType = $modalStore[0]?.meta?.showType;
  let showEquation = $modalStore[0]?.meta?.showEquation;
</script>

<FormModal let:data let:action let:id>
  <span slot="content">
    <FormDataset
      {data}
      {action}
      {id}
      {showColor}
      {showType}
      {showEquation}
      {customQueries}
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
