<script lang="ts">
  import ListJournalEntry from '$lib/components/ListJournalEntry.svelte';
  import Form from '$lib/components/forms/Form.svelte';
  import FormBodyJournalEntry from '$lib/components/forms/bodies/FormBodyJournalEntry.svelte';
  import { journalEntrySchema } from '$lib/zodSchemas';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="grid grid-cols-1 mb-10">
  <div>
    <h1 class="mb-3">New Journal Entry</h1>

    <Form resetForm={true} schema={journalEntrySchema} action="/journalEntry?/new" let:superForm>
      <FormBodyJournalEntry {superForm} />
    </Form>
  </div>
</div>

<div>
  <h1 class="mb-3">Entries</h1>

  <ListJournalEntry journalEntries={data.journalEntries} />
</div>
