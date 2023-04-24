<script lang="ts">
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import { enhance } from '$app/forms';
	import DateInput from '$lib/components/dateInput.svelte';
	import type { CalendarEvent } from '@prisma/client';
	import { page } from '$app/stores';
	import { CalendarEventFormData } from '$lib/calendarEvent';

	// Form action to execute
	export let action = '?/newCalendarEvent';

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	export let calendarEvent: CalendarEvent | undefined = undefined;
	export let calendarEventFormData: CalendarEventFormData = new CalendarEventFormData();
	export let successCallback: (() => Promise<void>) | undefined;
	export let shouldUseEnhance: boolean = true;

	$: {
		if (calendarEvent != undefined) {
			calendarEventFormData = new CalendarEventFormData(calendarEvent);
		}
	}
</script>

<form
	method="POST"
	{action}
	use:enhance={shouldUseEnhance
		? () => {
				return async ({ result }) => {
					if (result.type == 'success') {
						if (successCallback) {
							await successCallback();
						}
					}
				};
		  }
		: undefined}
>
	<label class="font-bold" for="dateStart">Date Start</label>
	<br />
	<DateInput name="dateStart" bind:date={calendarEventFormData.dateStart} style="width: 150px" />
	<br />

	<label class="font-bold" for="dateEnd">Date End</label>
	<br />
	<DateInput name="dateEnd" bind:date={calendarEventFormData.dateEnd} style="width: 150px" />
	<br />

	<label class="font-bold" for="title">Title</label>
	<br />
	<input type="text" name="title" value={calendarEventFormData.title || ''} style="width: 150px" />
	<br />

	<label class="font-bold" for="color">Color</label>
	<br />
	<input type="text" name="color" value={calendarEventFormData.color || ''} style="width: 150px" />
	<br />

	<label class="font-bold" for="content">Content</label>
	<br />
	<br />
	<TabEnabledTextArea
		name="content"
		cols="40"
		rows="10"
		class="w-full"
		placeholder="Trip to Moab"
		bind:value={calendarEventFormData.content}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
