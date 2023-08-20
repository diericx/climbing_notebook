<script lang="ts">
  import { calendarEventSchema } from '$lib/calendarEvent';
  import FormBodyCalendarEvent from '../../forms/bodies/FormBodyCalendarEvent.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={calendarEventSchema} let:superForm let:formProps>
  <FormBodyCalendarEvent {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
