<script lang="ts">
	import { page } from '$app/stores';
	import { journalEntrySchema, type JournalEntrySchema } from '$lib/journalEntry';
	import { defaultData, superForm } from 'sveltekit-superforms/client';
	import DateField from './DateField.svelte';
	import TextArea from './TextArea.svelte';
	import type { JournalEntry } from '@prisma/client';
	import { assignDefined } from '$lib/utils';

	// Form action to execute
	export let action = '/journalEntry?/newJournalEntry';
	export let data: JournalEntry | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let applyDefaults = false;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	let formData = data;
	if (applyDefaults) {
		formData = assignDefined(defaultData(journalEntrySchema), data || {});
	}
	const newSuperForm = superForm<JournalEntrySchema>(
		assignDefined(formData,
		{
			resetForm: true,
			onResult({ result }) {
				if (result.type == 'success' && onSuccess != undefined) {
					onSuccess();
				}
			}
		}
	);
	const { enhance } = newSuperForm;
</script>

<form method="POST" {action} use:enhance {id}>
	<input type="hidden" name="type" value="climbing" />

	<DateField name="date" field="date" form={newSuperForm} />

	<span class="text-gray-400"
		>Metrics will be detected and captured in your journal entries as long as they strictly follow
		the format below.
		<br />
		A name (letters or numbers), followed by a semicolon, followed by a number. An example will be shown
		below:
		<br />
		leftRingFingerA4PulleyPain: 4
	</span>
	<TextArea
		name="content"
		form={newSuperForm}
		field="content"
		cols={40}
		rows={10}
		class="w-full"
		placeholder={`- Worked on 7b in Daone, first two moves dialled
- shoulder started to act up mid way through session but didn't affect performance

leftShoulderPain: 2`}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
