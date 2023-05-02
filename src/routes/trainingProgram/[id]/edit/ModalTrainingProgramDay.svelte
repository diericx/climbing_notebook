<script lang="ts">
	import Modal from '../../../Modal.svelte';
	import type { TrainingProgramDay } from '@prisma/client';
	import { TrainingProgramDayFormData } from '$lib/trainingProgramDay';
	import EnhancedForm from '$lib/components/enhancedForm.svelte';

	export let showModal = false;
	export let trainingProgramDay: TrainingProgramDay | undefined = undefined;
	export let formData = new TrainingProgramDayFormData();
	export let action: string;
	const formId = crypto.randomUUID();

	function changeShowModal(value: boolean) {
		showModal = value;
	}
</script>

<Modal bind:showModal>
	<h1>Edit Program Day</h1>

	<EnhancedForm id={formId} {action} onSuccess={() => (showModal = false)}>
		<label for="desription">Description</label>
		<br />
		<input type="text" name="description" value={trainingProgramDay?.description || ''} />
	</EnhancedForm>

	<div slot="buttons">
		<slot name="modal-buttons" {formData} {changeShowModal}>
			<button type="submit" form={formId} value="Submit">Submit</button>
		</slot>
	</div>
</Modal>
<slot name="open-modal-buttons" {formData} {changeShowModal} />
