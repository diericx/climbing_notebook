<script lang="ts">
	import type { Validation } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import type { CalendarEventSchema } from '$lib/calendarEvent';
	import DateInput from '$lib/components/dateInput.svelte';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';

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

	const { form, enhance, constraints, errors } = superForm(data, {
		resetForm: true,
		onResult({ result }) {
			if (result.type == 'success' && onSuccess != undefined) {
				onSuccess();
			}
		}
	});
</script>

<form method="POST" {action} use:enhance {id}>
	<label class="font-bold" for="dateStart">Date Start</label>
	<br />
	<DateInput
		name="dateStart"
		bind:date={$form.dateStart}
		style="width: 150px"
		{...$constraints.dateEnd}
	/>
	<br />

	<label class="font-bold" for="dateEnd">Date End</label>
	<br />
	<DateInput
		name="dateEnd"
		bind:date={$form.dateEnd}
		style="width: 150px"
		{...$constraints.dateEnd}
	/>
	<br />
	{#if $errors.dateEnd}
		<span class="invalid">{$errors.dateEnd}</span>
		<br />
	{/if}

	<label class="font-bold" for="title">Title</label>
	<br />
	<input
		type="text"
		name="title"
		bind:value={$form.title}
		style="width: 150px"
		{...$constraints.title}
	/>
	<br />
	{#if $errors.title}
		<span class="invalid">{$errors.title}</span>
		<br />
	{/if}

	<label class="font-bold" for="color">Color</label>
	<br />
	<input
		type="text"
		name="color"
		bind:value={$form.color}
		style="width: 150px"
		{...$constraints.color}
	/>
	<br />
	{#if $errors.color}
		<span class="invalid">{$errors.color}</span>
		<br />
	{/if}

	<label class="font-bold" for="content">Content</label>
	<br />
	<TabEnabledTextArea
		name="content"
		cols="40"
		rows="10"
		class="w-full"
		placeholder="Trip to Moab"
		bind:value={$form.content}
		{...$constraints.content}
	/>
	{#if $errors.color}<span class="invalid">{$errors.content}</span>{/if}
	<br />

	{#if showSubmitButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</form>
