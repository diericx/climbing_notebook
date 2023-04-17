<script lang="ts">
	import type { JournalEntryFormData } from '$lib/journalEntry';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import dayjs from 'dayjs';
	import { enhance } from '$app/forms';

	export let journalEntryFormData: JournalEntryFormData;
	// Form action to execute
	export let action: string = '?/newJournalEntry';
	export let redirectTo: string = '';

	let dateString = dayjs(new Date()).format('YYYY-MM-DD');
</script>

<form method="POST" {action} use:enhance>
	<input type="hidden" name="type" value="climbing" />
	<input type="hidden" name="redirectTo" value={redirectTo} />

	<label class="font-bold" for="date">Date</label>
	<br />
	<input type="date" name="date" bind:value={dateString} style="width: 150px" />
	<br />

	<label class="font-bold" for="content">Content</label>
	<br />
	<span class="text-gray-400"
		>Metrics will be detected and captured in your journal entries as long as they strictly follow
		the format below.
		<br />
		A name (letters only), followed by a semicolon, followed by a number. An example will be shown below:
		<br />
		leftRingFingerPain: 4
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
		bind:value={journalEntryFormData.content}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
