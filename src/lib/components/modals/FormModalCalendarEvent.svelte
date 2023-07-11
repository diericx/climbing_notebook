<script lang="ts">
  import FormCalendarEvent from '../forms/FormCalendarEvent.svelte';
  import FormModal from './FormModal.svelte';
  import { calendarEventSchema } from '$lib/calendarEvent';
</script>

<FormModal schema={calendarEventSchema} let:superForm>
  <FormCalendarEvent {superForm} showSubmitButton={false} />
</FormModal>
