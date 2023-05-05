<script lang="ts">
	import FormCalendarEvent from '$lib/components/forms/FormCalendarEvent.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: calendarEvent = data.calendarEvent;
</script>

<div class="grid grid-cols-1">
	<div>
		<h1>Edit Calendar Event</h1>
		<FormCalendarEvent action="?/editCalendarEvent" data={data.calendarEvent} />
	</div>
</div>
