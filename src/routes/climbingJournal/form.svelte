<script lang="ts">
	import { onMount } from 'svelte';
	import type { JournalEntryFormData } from '$lib/journalEntry';

	export let journalEntryFormData: JournalEntryFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/new';
	export let redirectTo: string = '';

	let now = new Date(),
		month,
		day,
		year;
	let dateString = '';
	onMount(() => {
		(month = '' + (now.getMonth() + 1)), (day = '' + now.getDate()), (year = now.getFullYear());

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		dateString = [year, month, day].join('-');
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key == 'Tab') {
			let target = e.target as HTMLInputElement;
			e.preventDefault();
			var start = target.selectionStart;
			var end = target.selectionEnd;
			// If either start or end is null, this logic cannot be applied here
			// and it will be best to simply disable the key
			if (start == null || end == null) {
				return;
			}
			// set textarea value to: text before caret + tab + text after caret
			journalEntryFormData.content =
				journalEntryFormData.content.substring(0, start) +
				'\t' +
				journalEntryFormData.content.substring(end);
		}
	};
</script>

<form method="POST" {action}>
	<input type="hidden" name="type" value="climbing" />
	<input type="hidden" name="redirectTo" value={redirectTo} />

	<label for="date">Date</label>
	<br />
	<input type="date" name="date" bind:value={dateString} style="width: 150px" />
	<br />

	<label for="content">Content</label>
	<br />
	<textarea
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
		on:keydown={onKeyDown}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
