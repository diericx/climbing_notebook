<script lang="ts">
	import { journalEntrySchema } from '$lib/journalEntry';
	import DateField from './DateField.svelte';
	import TextArea from './TextArea.svelte';
	import type { JournalEntry } from '@prisma/client';
	import Form from './Form.svelte';

	// Form action to execute
	export let action = '/journalEntry?/newJournalEntry';
	export let data: JournalEntry | undefined = undefined;
	export let onSuccess: (() => Promise<void>) | undefined = undefined;
	export let id = crypto.randomUUID();
</script>

<Form schema={journalEntrySchema} {data} {action} {id} {onSuccess} let:form>
	<input type="hidden" name="_formId" value={id} />
	<input type="hidden" name="type" value="climbing" />

	<DateField name="date" field="date" {form} />

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
		{form}
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
</Form>
