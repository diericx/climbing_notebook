<script lang="ts">
	import { journalEntrySchema } from '$lib/journalEntry';
	import DateField from './fields/DateField.svelte';
	import TextArea from './fields/TextArea.svelte';
	import type { JournalEntry } from '@prisma/client';
	import Form from './Form.svelte';
	import { v4 as uuidv4 } from 'uuid';

	// Form action to execute
	export let action = '/journalEntry?/new';
	export let data: JournalEntry | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = uuidv4();
</script>

<Form schema={journalEntrySchema} {data} {action} {id} {onSuccess} resetForm={true} let:form>
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

	<button class="btn btn-primary btn-sm variant-filled">Submit</button>
</Form>
