<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormBodyExerciseEvent from '../forms/bodies/FormBodyExerciseEvent.svelte';
  import FormModal from './FormModal.svelte';
  import { exerciseEventSchema } from '$lib/exerciseEvent';

  let exerciseToMarkCompleted = $modalStore[0]?.meta?.exerciseToMarkCompleted;
  let dateToMarkCompleted = $modalStore[0]?.meta?.dateToMarkCompleted;
  let showDifficulty = $modalStore[0]?.meta?.showDifficulty;
  let showDate = $modalStore[0]?.meta?.showDate;
  let exercises = $modalStore[0]?.meta?.exercises;
  let showMigrationOption = $modalStore[0]?.meta?.showMigrationOption;
</script>

<FormModal schema={exerciseEventSchema} let:superForm>
  <FormBodyExerciseEvent
    {exercises}
    {exerciseToMarkCompleted}
    {dateToMarkCompleted}
    {showDifficulty}
    {showMigrationOption}
    {showDate}
    {superForm}
    showSubmitButton={false}
  />
</FormModal>
