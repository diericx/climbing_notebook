<script lang="ts">
  import Form from '$lib/components/forms/Form.svelte';
  import FormBodyJournalEntry from '$lib/components/forms/bodies/FormBodyJournalEntry.svelte';
  import { journalEntrySchema } from '$lib/zodSchemas';
  import type { PageData } from './$types';

  export let data: PageData;

  const { journalEntry } = data;
</script>

<div class="grid grid-cols-1">
  <div>
    <h1 class="mb-3">Edit Journal Entry</h1>
    <Form
      data={journalEntry}
      resetForm={true}
      schema={journalEntrySchema}
      action={`/journalEntry/${journalEntry.id}?/edit&redirectTo/journalEntry`}
      let:superForm
    >
      <FormBodyJournalEntry {superForm} />
    </Form>
  </div>
</div>
