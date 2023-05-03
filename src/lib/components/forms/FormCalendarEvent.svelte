<script lang="ts">
	import type { Validation } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import type { CalendarEventSchema } from '$lib/calendarEvent';
	import DateInput from '$lib/components/dateInput.svelte';
	import TextField from './TextField.svelte';
	import TextArea from './TextArea.svelte';
	import DateField from './DateField.svelte';

	// Incoming form data
	export let data: Validation<CalendarEventSchema>;
	// Form action to execute
	export let action = '?/newCalendarEvent';
	// Form customization
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
	export let onSuccess: (() => Promise<void>) | undefined;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	const superFrm = superForm<CalendarEventSchema>(data, {
		resetForm: true,
		onResult({ result }) {
			if (result.type == 'success' && onSuccess != undefined) {
				onSuccess();
			}
		}
	});
	const { form, enhance, constraints, errors } = superFrm;
</script>

<form method="POST" {action} use:enhance {id}>
	<DateField name="dateStart" form={superFrm} field="dateStart" />
	<DateField name="dateEnd" form={superFrm} field="dateEnd" />
	<TextField name="title" form={superFrm} field="title" placeholder={'Trip to Moab'} />
	<TextField name="color" form={superFrm} field="color" placeholder={'green'} />
	<TextArea
		name="content"
		form={superFrm}
		field="content"
		cols={40}
		rows={10}
		class="w-full"
		placeholder={'Going to Moab with Megan and Alex'}
	/>

	{#if showSubmitButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</form>
