<script lang="ts">
	import Modal from '$lib/components/modals/Modal.svelte';
	import FormCalendarEvent from '$lib/components/forms/FormCalendarEvent.svelte';
	import { invalidateAll } from '$app/navigation';
	import type { CalendarEvent } from '@prisma/client';

	export let showModal = false;
	export let calendarEvent: CalendarEvent | undefined = undefined;

	let formId = crypto.randomUUID();
</script>

<Modal bind:showModal>
	<h1>New Calendar Event</h1>
	<FormCalendarEvent
		id={formId}
		action="/calendarEvent?/new"
		showSubmitButton={false}
		data={calendarEvent}
		onSuccess={async () => {
			showModal = false;
			await invalidateAll();
		}}
	/>
	<div slot="buttons">
		<slot name="modal-buttons">
			<button type="submit" form={formId} value="Submit">Save</button>
		</slot>
	</div>
</Modal>
