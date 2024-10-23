<script lang="ts">
  import FormBodyJournalEntry from '$lib/components/forms/bodies/FormBodyJournalEntry.svelte';
  import { projectSchema } from '$lib/zodSchemas';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={projectSchema} let:superForm let:formProps>
  <FormBodyJournalEntry {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
