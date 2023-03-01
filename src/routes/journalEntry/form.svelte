<script lang="ts">
	import type { JournalEntryFormData } from '$lib/journalEntry';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import dayjs from 'dayjs';
	import { enhance } from '$app/forms';

	export let journalEntryFormData: JournalEntryFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/new';
	export let redirectTo: string = '';

	let dateString = dayjs(new Date()).format('YYYY-MM-DD');
</script>

<form method="POST" {action} use:enhance>
	<input type="hidden" name="type" value="climbing" />
	<input type="hidden" name="redirectTo" value={redirectTo} />

	<label for="date">Date</label>
	<br />
	<input type="date" name="date" bind:value={dateString} style="width: 150px" />
	<br />

	<label for="content">Content</label>
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
Injuries
- Left ring finger pain (3) in A2 pulley
- Right shoulder pain mid session, went away by end"
		bind:value={journalEntryFormData.content}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
