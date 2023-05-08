<script lang="ts">
	import type { CalendarEvent } from '@prisma/client';
	import Form from './Form.svelte';
	import TextArea from './fields/TextArea.svelte';
	import DateField from './fields/DateField.svelte';
	import TextField from './fields/TextField.svelte';
	import { calendarEventSchema } from '$lib/calendarEvent';

	export let data: CalendarEvent | undefined = undefined;
	export let action = '?/newCalendarEvent';
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
	export let onSuccess: (() => void) | undefined = undefined;
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
