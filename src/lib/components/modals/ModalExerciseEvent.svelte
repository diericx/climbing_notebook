<script lang="ts">
	import type { ExerciseEvent } from '@prisma/client';
	import Modal from '$lib/components/modals/Modal.svelte';
	import ExerciseEventForm from '$lib/components/forms/FormExerciseEvent.svelte';

	export let data: ExerciseEvent | undefined = undefined;
	export let showModal = false;
	export let exerciseToMarkCompleted: ExerciseEvent | undefined = undefined;
	export let dateToMarkCompleted: Date | undefined = undefined;
	export let title = 'New Exercise';
	export let action: string;
	export let showDate = false;
	export let showDifficulty = false;
	export let applyDefaults = false;
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
		{showDate}
		{applyDefaults}
		{data}
		{showDifficulty}
		showSubmitButton={false}
		onSuccess={() => (showModal = false)}
	/>

	<div slot="buttons">
		<slot name="modal-buttons" {data} {changeShowModal}>
			<button type="submit" form={formId} value="Submit">Save</button>
		</slot>
	</div>
</Modal>
<slot name="open-modal-buttons" {data} {changeShowModal}>
	<button
		type="submit"
		form={formId}
		class="align-middle bg-red-400 hover:bg-red-500 text-white font-bold px-2 rounded">Save</button
	>
</slot>
