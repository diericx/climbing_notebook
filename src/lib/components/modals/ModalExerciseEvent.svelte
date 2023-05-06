<script lang="ts">
	import type { ExerciseEvent } from '@prisma/client';
	import Modal from '$lib/components/modals/Modal.svelte';
	import FormExerciseEvent from '$lib/components/forms/FormExerciseEvent.svelte';

	export let data: ExerciseEvent | undefined = undefined;
	export let isModalVisible = false;
	export let exerciseToMarkCompleted: ExerciseEvent | undefined = undefined;
	export let dateToMarkCompleted: Date | undefined = undefined;
	export let title = 'New Exercise';
	export let action: string;
	export let showDate = false;
	export let showDifficulty = false;
	const formId = crypto.randomUUID();

	function showModal() {
		isModalVisible = true;
	}
	function hideModal() {
		isModalVisible = false;
	}
</script>

<Modal bind:showModal={isModalVisible}>
	<h1>{title}</h1>
	<FormExerciseEvent
		{action}
		id={formId}
		{exerciseToMarkCompleted}
		{dateToMarkCompleted}
		{showDate}
		{data}
		{showDifficulty}
		showSubmitButton={false}
		onSuccess={() => (isModalVisible = false)}
	/>

	<div slot="buttons">
		<slot name="modal-buttons" {data} {showModal}>
			<button type="submit" form={formId} value="Submit">Save</button>
		</slot>
	</div>
</Modal>
<slot name="open-modal-buttons" {data} {showModal} />
