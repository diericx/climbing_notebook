<script lang="ts">
	import Modal from '../../../Modal.svelte';
	import type { ExerciseGroup } from '@prisma/client';
	import { ExerciseGroupFormData } from '$lib/exerciseGroup';
	import EnhancedForm from '$lib/components/enhancedForm.svelte';
	import Icon from '@iconify/svelte';

	export let showModal = false;
	export let exerciseGroup: ExerciseGroup | undefined = undefined;
	export let formData = new ExerciseGroupFormData();
	export let title = 'New Exercise Group';
	export let action: string;
	const formId = crypto.randomUUID();

	function changeShowModal(value: boolean) {
		showModal = value;
	}
</script>

<Modal bind:showModal>
	<h1>{title}</h1>

	<EnhancedForm id={formId} {action} onSuccess={() => (showModal = false)}>
		<label for="name">Name</label>
		<br />
		<input type="text" name="name" value={exerciseGroup?.name || ''} />
	</EnhancedForm>

	<div slot="buttons">
		<slot name="modal-buttons" {formData} {changeShowModal}>
			<button type="submit" form={formId} value="Submit">Submit</button>
		</slot>
	</div>
</Modal>
<slot name="open-modal-buttons" {formData} {changeShowModal}>
	<button class="icon-button ml-0" on:click={() => changeShowModal(true)}>
		<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
		<span class="ml-1 mr-1"> Add Group </span>
	</button>
</slot>
