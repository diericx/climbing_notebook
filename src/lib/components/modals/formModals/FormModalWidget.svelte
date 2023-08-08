<script lang="ts">
  import FormBodyWidget from '../../forms/bodies/FormBodyWidget.svelte';
  import FormModal from './FormModal.svelte';
  import { widgetSchema } from '$lib/widget';
</script>

<FormModal schema={widgetSchema} let:superForm let:formProps>
  <FormBodyWidget {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
