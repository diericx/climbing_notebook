<script lang="ts">
	import { JournalEntryFormData } from '$lib/journalEntry';
	import type { JournalEntry } from '@prisma/client';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import DateInput from '$lib/components/dateInput.svelte';
	import EnhancedForm from '$lib/components/enhancedForm.svelte';

	// Form action to execute
	export let action = '/journalEntry?/newJournalEntry';

	export let journalEntry: JournalEntry | undefined = undefined;
	export let formData = new JournalEntryFormData();
</script>

<EnhancedForm
	{action}
	bind:formData
	formDataDefaults={new JournalEntryFormData(
		journalEntry || {
			date: new Date(),
			content: ''
		}
	)}
>
	<input type="hidden" name="type" value="climbing" />

	<label class="font-bold" for="date">Date</label>
	<br />
	<DateInput name="date" bind:date={formData.date} style="width: 150px" />
	<br />

	<label class="font-bold" for="content">Content</label>
	<br />
	<span class="text-gray-400"
		>Metrics will be detected and captured in your journal entries as long as they strictly follow
		the format below.
		<br />
		A name (letters or numbers), followed by a semicolon, followed by a number. An example will be shown
		below:
		<br />
		leftRingFingerA4PulleyPain: 4
	</span>
	<br />
	<TabEnabledTextArea
		name="content"
		cols="40"
		rows="10"
		class="w-full"
		placeholder="Climbing
- max bouldering session
- white C+ in back
	- get high left foot before bumping left hand
Injury tracking:
- slight pain in left finger entire session
- pain in right shoulder in beginning but gone by end of session

leftRingFingerPainA2Pulley: 3
rightShoulderPain: 2"
		bind:value={formData.content}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</EnhancedForm>
