<script lang="ts">
  import FormBodyJournalEntry from '$lib/components/forms/bodies/FormBodyJournalEntry.svelte';
  import { journalEntrySchema } from '$lib/zodSchemas';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={journalEntrySchema} let:superForm let:formProps>
  <FormBodyJournalEntry {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
