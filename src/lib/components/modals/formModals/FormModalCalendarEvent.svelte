<script lang="ts">
  import { calendarEventSchema } from '$lib/zodSchemas';
  import { useQueryClient } from '@sveltestack/svelte-query';
  import FormBodyCalendarEvent from '../../forms/bodies/FormBodyCalendarEvent.svelte';
  import FormModal from './FormModal.svelte';

  const queryClient = useQueryClient();
</script>

<FormModal
  schema={calendarEventSchema}
  let:superForm
  let:formProps
  onSuccess={() => queryClient.invalidateQueries('calendarEvents')}
>
  <FormBodyCalendarEvent {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
