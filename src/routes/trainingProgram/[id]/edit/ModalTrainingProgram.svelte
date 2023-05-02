<script lang="ts">
	import Modal from '../../../Modal.svelte';
	import type { TrainingProgram } from '@prisma/client';
	import { TrainingProgramFormData } from '$lib/trainingProgram';
	import TrainingProgramForm from '../../form.svelte';

	export let showModal = false;
	export let trainingProgram: TrainingProgram | undefined = undefined;
	export let formData = new TrainingProgramFormData();
	export let action: string;
	const formId = crypto.randomUUID();

	function changeShowModal(value: boolean) {
		showModal = value;
	}
</script>

<Modal bind:showModal>
	<h1>Edit Training Program</h1>

	<TrainingProgramForm
		{trainingProgram}
		id={formId}
		{action}
		showButton={false}
		onSuccess={() => (showModal = false)}
	/>

	<div slot="buttons">
		<slot name="modal-buttons" {formData} {changeShowModal}>
			<button type="submit" form={formId} value="Submit">Submit</button>
		</slot>
	</div>
</Modal>
<slot name="open-modal-buttons" {formData} {changeShowModal}>
	<button
		class="align-middle bg-green-400 hover:bg-green-500 text-white font-bold px-2 rounded"
		on:click={() => changeShowModal(true)}>New Training Program</button
	>
</slot>

