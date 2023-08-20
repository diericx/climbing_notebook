<script lang="ts">
  import Form from '$lib/components/forms/Form.svelte';
  import FormBodyJournalEntry from '$lib/components/forms/bodies/FormBodyJournalEntry.svelte';
  import { journalEntrySchema } from '$lib/journalEntry';
  import type { PageData } from './$types';

  export let data: PageData;

  const { journalEntry } = data;
</script>

<div class="grid grid-cols-1">
  <div>
    <h2>Edit Journal Entry</h2>
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
