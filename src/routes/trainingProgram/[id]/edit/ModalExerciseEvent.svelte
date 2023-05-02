<script lang="ts">
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import Modal from '../../../Modal.svelte';
	import ExerciseEventForm from '../../../exerciseEvent/form.svelte';
	import type { ExerciseEvent, ExerciseGroup, TrainingProgramDay } from '@prisma/client';

	export let showModal = false;
	export let exerciseEvent: ExerciseEvent | undefined = undefined;
	export let exerciseGroup: ExerciseGroup | undefined = undefined;
	export let trainingProgramDay: TrainingProgramDay | undefined = undefined;
	export let formData = new ExerciseEventFormData();
	export let title = 'New Exercise';
	export let action: string;
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
		{exerciseEvent}
		{exerciseGroup}
		{trainingProgramDay}
		bind:formData
		showDate={false}
		showDifficulty={false}
		showButton={false}
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
