<script lang="ts">
  import { profileSchema } from '$lib/zodSchemas';
  import type { Profile } from '@prisma/client';
  import { v4 as uuidv4 } from 'uuid';
  import Form from './Form.svelte';
  import SelectField from './fields/SelectField.svelte';
  import SubmitButton from './fields/SubmitButton.svelte';
  import TextArea from './fields/TextArea.svelte';

  // Form action to execute
  export let action = '';
  export let data: Profile | undefined = undefined;
  export let onSuccess: (() => Promise<void>) | undefined = undefined;
  export let id = uuidv4();
  export let showSubmitButton = true;
</script>

<Form schema={profileSchema} {data} {action} {id} {onSuccess} let:superForm>
  <input type="hidden" name="type" value="climbing" />

  <SelectField name="weightUnit" field="weightUnit" form={superForm}>
    <option value={'kg'}>Kilograms</option>
    <option value={'lb'}>Pounds</option>
  </SelectField>

  <TextArea
    name="goals"
    field="goals"
    form={superForm}
    class="w-full"
    rows={15}
    placeholder={`3 weeks
- Be able to do 3 pull ups unassisted (shoulder recovery)

3 months
- Climb 7a boulder
- 5 pull ups @ 10kg
- 15mm hang @ 20kg

1 year
- Climb 7b
- 5 pull ups @ 15kg
- 10mm hang @ 10kg
	`}
  />

  <br />

  {#if showSubmitButton}
    <SubmitButton {superForm} />
  {/if}
</Form>
