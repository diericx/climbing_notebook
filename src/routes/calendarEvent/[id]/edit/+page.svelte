<script lang="ts">
  import { calendarEventSchema } from '$lib/calendarEvent';
  import Form from '$lib/components/forms/Form.svelte';
  import FormBodyCalendarEvent from '$lib/components/forms/bodies/FormBodyCalendarEvent.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  const { calendarEvent } = data;
</script>

<div class="grid grid-cols-1">
  <div>
    <h1>Edit Calendar Event</h1>
    <Form
      schema={calendarEventSchema}
      data={calendarEvent}
      action={`/calendarEvent/${calendarEvent.id}?/edit`}
      let:superForm
    >
      <FormBodyCalendarEvent {superForm} />
    </Form>
  </div>
</div>
