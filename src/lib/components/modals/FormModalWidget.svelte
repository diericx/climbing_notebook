<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormBodyWidget from '../forms/bodies/FormBodyWidget.svelte';
  import FormModal from './FormModal.svelte';
  import { widgetSchema } from '$lib/widget';

  let showType = $modalStore[0]?.meta?.showType;
  let showOrder = $modalStore[0]?.meta?.showOrder;
  let trainingPrograms = $modalStore[0]?.meta?.trainingPrograms;
</script>

<FormModal schema={widgetSchema} let:superForm>
  <FormBodyWidget {superForm} {showType} {showOrder} {trainingPrograms} showSubmitButton={false} />
</FormModal>
