<script lang="ts">
  import FormBodyCalendarEvent from '../../forms/bodies/FormBodyCalendarEvent.svelte';
  import FormModal from './FormModal.svelte';
  import { calendarEventSchema } from '$lib/calendarEvent';
</script>

<FormModal schema={calendarEventSchema} let:superForm let:formProps>
  <FormBodyCalendarEvent {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
