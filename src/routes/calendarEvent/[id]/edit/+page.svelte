<script lang="ts">
	import CalendarEventForm from '../../form.svelte';
	import { CalendarEventFormData } from '$lib/calendarEvent';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h1>Edit Calendar Event</h1>
		<CalendarEventForm
			shouldUseEnhance={false}
			action="?/editCalendarEvent"
			calendarEvent={data.calendarEvent}
			calendarEventFormData={new CalendarEventFormData(form?.calendarEventFormData)}
		/>
	</div>
</div>
