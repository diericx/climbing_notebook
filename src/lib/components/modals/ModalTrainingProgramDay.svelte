<script lang="ts">
	import type { TrainingProgramDay } from '@prisma/client';
	import FormTrainingProgramDay from '../forms/FormTrainingProgramDay.svelte';
	import Modal from './Modal.svelte';

	export let showModal = false;
	export let data: TrainingProgramDay | undefined = undefined;
	export let action: string;
	const formId = crypto.randomUUID();

	function changeShowModal(value: boolean) {
		showModal = value;
	}
</script>

<Modal bind:showModal>
	<h1>Edit Program Day</h1>

	<FormTrainingProgramDay id={formId} {action} onSuccess={() => (showModal = false)} />

	<div slot="buttons">
		<slot name="modal-buttons" {data} {changeShowModal}>
			<button type="submit" form={formId} value="Submit">Submit</button>
		</slot>
	</div>
</Modal>
<slot name="open-modal-buttons" {data} {changeShowModal} />
