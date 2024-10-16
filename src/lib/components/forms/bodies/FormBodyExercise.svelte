<script lang="ts">
  import {
    difficulties,
    equipments,
    exerciseEventFieldsToShow,
    exerciseTypes,
    muscleGroups,
    muscles,
    postures,
  } from '$lib/utils';
  import type { ExerciseSchema } from '$lib/zodSchemas';
  import type { Infer } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextField from '../fields/TextField.svelte';

  export let superForm: SuperForm<Infer<ExerciseSchema>>;
  export let showSubmitButton = true;

  const { form, errors } = superForm;
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

<label>
  <span class="font-bold">Fields to Show</span>
  <slot name="description" />
</label>
{#each exerciseEventFieldsToShow as option}
  <label class="text-black">
    <input type="checkbox" bind:group={$form.fieldsToShow} value={option} {...$$restProps} />
    {option}
  </label>
{/each}
{#if $errors.fieldsToShow?._errors}<p class="invalid">{$errors.fieldsToShow._errors}</p>{/if}

<TextField name="videoUrl" field="videoUrl" form={superForm} />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}

<style lang="scss">
  .invalid {
    color: orangered;
  }
</style>
