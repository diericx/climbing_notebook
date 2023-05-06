<script lang="ts">
	import type { Validation } from 'sveltekit-superforms';
	import { defaultData, superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import { calendarEventSchema, type CalendarEventSchema } from '$lib/calendarEvent';
	import TextField from './TextField.svelte';
	import TextArea from './TextArea.svelte';
	import DateField from './DateField.svelte';
	import type { CalendarEvent } from '@prisma/client';
	import { assignDefined } from '$lib/utils';
	import type { z } from 'zod';

	// Incoming form data
	export let data: CalendarEvent | undefined = undefined;
	// Form action to execute
	export let action = '?/newCalendarEvent';
	// Form customization
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
	export let onSuccess: (() => Promise<void>) | undefined = undefined;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	let formData: z.infer<CalendarEventSchema> = assignDefined(
		defaultData(calendarEventSchema),
		data || {}
	);
	const newSuperForm = superForm<CalendarEventSchema>(formData, {
		resetForm: true,
		id,
		onResult({ result }) {
			if (result.type == 'success' && onSuccess != undefined) {
				onSuccess();
			}
		}
	});
	const { enhance } = newSuperForm;
</script>

<form method="POST" {action} use:enhance {id}>
	<input type="hidden" name="_formId" value={id} />

	<DateField name="dateStart" form={newSuperForm} field="dateStart" />
	<DateField name="dateEnd" form={newSuperForm} field="dateEnd" />
	<TextField name="title" form={newSuperForm} field="title" placeholder={'Trip to Moab'} />
	<TextField name="color" form={newSuperForm} field="color" placeholder={'green'} />
	<TextArea
		name="content"
		form={newSuperForm}
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
