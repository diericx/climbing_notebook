<script lang="ts">
  import { widgetSchema } from '$lib/widget';
  import FormBodyWidget from '../../forms/bodies/FormBodyWidget.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={widgetSchema} let:superForm let:formProps>
  <FormBodyWidget {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
