<script lang="ts">
  import TextField from './fields/TextField.svelte';
  import {
    difficulties,
    equipments,
    exerciseEventFieldsToShow,
    exerciseTypes,
    muscleGroups,
    muscles,
    postures,
  } from '$lib/utils';
  import SelectField from './fields/SelectField.svelte';
  import MultipleSelectField from './fields/MultipleSelectField.svelte';
  import SubmitButton from './fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
</script>

<TextField name="name" field="name" form={superForm} />

<SelectField name="type" field="type" form={superForm}>
  {#each exerciseTypes as type}
    <option value={type}>{type}</option>
  {/each}
</SelectField>
<SelectField name="difficulty" field="difficulty" form={superForm}>
  <option value={null}>N/A</option>
  {#each difficulties as difficulty}
    <option value={difficulty}>{difficulty}</option>
  {/each}
</SelectField>
<SelectField name="muscleGroup" field="muscleGroup" form={superForm}>
  <option value={null}>N/A</option>
  {#each muscleGroups as muscleGroup}
    <option value={muscleGroup}>{muscleGroup}</option>
  {/each}
</SelectField>
<SelectField name="primeMoverMuscle" field="primeMoverMuscle" form={superForm}>
  <option value={null}>N/A</option>
  {#each muscles as muscle}
    <option value={muscle}>{muscle}</option>
  {/each}
</SelectField>
<SelectField name="secondaryMuscle" field="secondaryMuscle" form={superForm}>
  <option value={null}>N/A</option>
  {#each muscles as muscle}
    <option value={muscle}>{muscle}</option>
  {/each}
</SelectField>
<SelectField name="tertiaryMuscle" field="tertiaryMuscle" form={superForm}>
  <option value={null}>N/A</option>
  {#each muscles as muscle}
    <option value={muscle}>{muscle}</option>
  {/each}
</SelectField>

<SelectField name="primaryEquipment" field="primaryEquipment" form={superForm}>
  <option value={null}>N/A</option>
  {#each equipments as equipment}
    <option value={equipment}>{equipment}</option>
  {/each}
</SelectField>

<SelectField name="posture" field="posture" form={superForm}>
  <option value={null}>N/A</option>
  {#each postures as posture}
    <option value={posture}>{posture}</option>
  {/each}
</SelectField>

<MultipleSelectField
  name="fieldsToShow"
  field="fieldsToShow"
  options={[...exerciseEventFieldsToShow]}
  form={superForm}
/>

<TextField name="videoUrl" field="videoUrl" form={superForm} />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
