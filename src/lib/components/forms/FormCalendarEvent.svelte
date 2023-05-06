<script lang="ts">
	import { calendarEventSchema } from '$lib/calendarEvent';
	import TextField from './TextField.svelte';
	import TextArea from './TextArea.svelte';
	import DateField from './DateField.svelte';
	import type { CalendarEvent } from '@prisma/client';
	import Form from './Form.svelte';

	// Incoming form data
	export let data: CalendarEvent | undefined = undefined;
	// Form action to execute
	export let action = '?/newCalendarEvent';
	// Form customization
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
	export let onSuccess: (() => Promise<void>) | undefined = undefined;
</script>

<Form schema={calendarEventSchema} {data} {action} {id} {onSuccess} let:form>
	<DateField name="dateStart" {form} field="dateStart" />
	<DateField name="dateEnd" {form} field="dateEnd" />
	<TextField name="title" {form} field="title" placeholder={'Trip to Moab'} />
	<TextField name="color" {form} field="color" placeholder={'green'} />
	<TextArea
		name="content"
		{form}
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
</Form>
