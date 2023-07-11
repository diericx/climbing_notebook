<script lang="ts">
  import type { CustomQuery, TrainingProgram } from '@prisma/client';
  import Form from './Form.svelte';
  import SelectField from './fields/SelectField.svelte';
  import { widgetSchema } from '$lib/widget';
  import NumberField from './fields/NumberField.svelte';
  import TextField from './fields/TextField.svelte';
  import { v4 as uuidv4 } from 'uuid';
  import SubmitButton from './fields/SubmitButton.svelte';

  // Form action to execute
  export let action = '';
  export let data: CustomQuery | undefined = undefined;
  export let onSuccess: (() => void) | undefined = undefined;
  export let id = uuidv4();
  export let showSubmitButton = true;
  export let showType = true;
  export let showOrder = true;
  export let trainingPrograms: TrainingProgram[] = [];

  let type = '';
</script>

<Form schema={widgetSchema} {data} {action} {id} {onSuccess} resetForm={true} let:form let:delayed>
  <!-- 
	Subscribe to the form so we can extract certain values. Placed in a function that
	returns a string so it will not render anything. This code is stupid. So it goes.
	-->
  {(() => {
    form.form.subscribe((_form) => {
      type = _form.type;
    });
    return '';
  })()}
  <!-- {JSON.stringify(_form.fields.name)} -->
  <TextField name="name" field="name" {form} />
  {#if showOrder}
    <NumberField name="order" field="order" {form} />
  {/if}
  <SelectField name="width" field="width" {form}>
    <option value="full">Full</option>
    <option value="half">Half</option>
  </SelectField>

  {#if showType}
    <SelectField name="type" field="type" {form}>
      <option value="chart"> Chart </option>
      <option value="calendar"> Full Calendar </option>
      <option value="heatmapCalendar"> Heatmap Calendar </option>
      <option value="dailyExerciseCalendar"> Daily Exercise Calendar </option>
    </SelectField>
  {/if}

  {#if type == 'dailyExerciseCalendar'}
    <SelectField name="trainingProgramId" field="trainingProgramId" label="Training Program" {form}>
      <option value={null}> Active Training Program </option>
      <option disabled>---------</option>
      {#each trainingPrograms as trainingProgram}
        <option value={trainingProgram.id}> {trainingProgram.name} </option>
      {/each}
    </SelectField>
  {/if}

  {#if showSubmitButton}
    <SubmitButton formId={id} {delayed} />
  {/if}
</Form>
