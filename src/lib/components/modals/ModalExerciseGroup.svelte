<script lang="ts">
	import Modal from '$lib/components/modals/Modal.svelte';
	import Icon from '@iconify/svelte';
	import FormExerciseGroup from '$lib/components/forms/FormExerciseGroup.svelte';
	import type { ExerciseGroup } from '@prisma/client';

	export let data: ExerciseGroup | undefined = undefined;
	export let showModal = false;
	export let title = 'New Exercise Group';
	export let action: string;
	const formId = crypto.randomUUID();

	function changeShowModal(value: boolean) {
		showModal = value;
	}
</script>

<Modal bind:showModal>
	<h1>{title}</h1>

	<FormExerciseGroup {data} id={formId} {action} onSuccess={() => (showModal = false)} />

	<div slot="buttons">
		<slot name="modal-buttons" {data} {changeShowModal}>
			<button type="submit" form={formId} value="Submit">Submit</button>
		</slot>
	</div>
</Modal>
<slot name="open-modal-buttons" {data} {changeShowModal}>
	<button class="icon-button ml-0" on:click={() => changeShowModal(true)}>
		<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
		<span class="ml-1 mr-1"> Add Group </span>
	</button>
</slot>
