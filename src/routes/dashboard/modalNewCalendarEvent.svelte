<script lang="ts">
	import Modal from '../Modal.svelte';
	import NewCalendarEventForm from '../calendarEvent/form.svelte';
	import { invalidateAll } from '$app/navigation';

	export let showModal = false;
</script>

<Modal bind:showModal>
	<h1>New Calendar Event</h1>
	<NewCalendarEventForm
		action="/calendarEvent?/newCalendarEvent"
		successCallback={async () => {
			showModal = false;
			await invalidateAll();
		}}
	/>
</Modal>
