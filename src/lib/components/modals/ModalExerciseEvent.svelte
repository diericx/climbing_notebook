<script lang="ts">
	import type { ExerciseEvent, ExerciseGroup, TrainingProgramDay } from '@prisma/client';
	import Modal from '$lib/components/modals/Modal.svelte';
	import type { ExerciseEventSchema } from '$lib/exerciseEvent';
	import type { Validation } from 'sveltekit-superforms/index';
	import ExerciseEventForm from '$lib/components/forms/FormExerciseEvent.svelte';

	export let formData: Validation<ExerciseEventSchema>;
	export let showModal = false;
	export let exerciseToMarkCompleted: ExerciseEvent | undefined = undefined;
	export let dateToMarkCompleted: Date | undefined = undefined;
	export let exerciseGroup: ExerciseGroup | undefined = undefined;
	export let trainingProgramDay: TrainingProgramDay | undefined = undefined;
	export let title = 'New Exercise';
	export let action: string;
	export let showDate = false;
	export let showDifficulty = false;
	const formId = crypto.randomUUID();

	function changeShowModal(value: boolean) {
		showModal = value;
	}
</script>

<Modal bind:showModal>
	<h1>{title}</h1>
	<ExerciseEventForm
		{action}
		id={formId}
		{exerciseToMarkCompleted}
		{dateToMarkCompleted}
		{exerciseGroup}
		{trainingProgramDay}
		{showDate}
		data={formData}
		{showDifficulty}
		showSubmitButton={false}
		onSuccess={() => (showModal = false)}
	/>

	<div slot="buttons">
		<slot name="modal-buttons" {formData} {changeShowModal}>
			<button type="submit" form={formId} value="Submit">Save</button>
		</slot>
	</div>
</Modal>
<slot name="open-modal-buttons" {formData} {changeShowModal}>
	<button
		type="submit"
		form={formId}
		class="align-middle bg-red-400 hover:bg-red-500 text-white font-bold px-2 rounded">Save</button
	>
</slot>
