<script lang="ts">
  import type { PageData } from './$types';
  import FormBodyJournalEntry from '$lib/components/forms/bodies/FormJournalEntry.svelte';
  import Form from '$lib/components/forms/Form.svelte';
  import { journalEntrySchema } from '$lib/journalEntry';

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
      action={`/journalEntry/${journalEntry.id}?/edit`}
      let:superForm
    >
      <FormBodyJournalEntry {superForm} />
    </Form>
  </div>
</div>
