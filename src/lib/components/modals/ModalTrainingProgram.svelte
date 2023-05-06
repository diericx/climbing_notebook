<script lang="ts">
	import type { TrainingProgram } from '@prisma/client';
	import FormTrainingProgram from '../forms/FormTrainingProgram.svelte';
	import Modal from './Modal.svelte';

	export let showModal = false;
	export let data: TrainingProgram | undefined = undefined;
	export let action: string;
	const formId = crypto.randomUUID();

	function changeShowModal(value: boolean) {
		showModal = value;
	}
</script>

<Modal bind:showModal>
	<h1>Edit Training Program</h1>

	<FormTrainingProgram
		{data}
		id={formId}
		{action}
		showSubmitButton={false}
		onSuccess={() => (showModal = false)}
	/>

	<div slot="buttons">
		<slot name="modal-buttons" {data} {changeShowModal}>
			<button type="submit" form={formId} value="Submit">Submit</button>
		</slot>
	</div>
</Modal>
<slot name="open-modal-buttons" {data} {changeShowModal}>
	<button
		class="align-middle bg-green-400 hover:bg-green-500 text-white font-bold px-2 rounded"
		on:click={() => changeShowModal(true)}>New Training Program</button
	>
</slot>
