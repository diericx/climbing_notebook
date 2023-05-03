<script lang="ts">
	import Modal from '$lib/components/modals/Modal.svelte';
	import FormCalendarEvent from '$lib/components/forms/FormCalendarEvent.svelte';
	import { invalidateAll } from '$app/navigation';
	import type { Validation } from 'sveltekit-superforms/index';
	import type { CalendarEventSchema } from '$lib/calendarEvent';

	export let showModal = false;
	export let newCalendarEventFormData: Validation<CalendarEventSchema>;

	let formId = crypto.randomUUID();
</script>

<Modal bind:showModal>
	<h1>New Calendar Event</h1>
	<FormCalendarEvent
		id={formId}
		action="/calendarEvent?/new"
		showSubmitButton={false}
		data={newCalendarEventFormData}
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
