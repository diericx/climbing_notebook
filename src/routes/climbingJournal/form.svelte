<script lang="ts">
	import { onMount } from 'svelte';
	import type { JournalEntryInput } from '$lib/journalEntry';
	import type { FormEventHandler } from '$lib/helperTypes';

	export let journalEntryInput: JournalEntryInput;
	export let action: String;
	export let redirectTo: String;

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

	const onKeyDown = (e) => {
		if (e.key == 'Tab') {
			e.preventDefault();
			var start = e.originalTarget.selectionStart;
			var end = e.originalTarget.selectionEnd;
			// set textarea value to: text before caret + tab + text after caret
			journalEntryInput.content =
				journalEntryInput.content.substring(0, start) +
				'\t' +
				journalEntryInput.content.substring(end);
		}
	};
</script>

<form method="POST" action={action || '?/new'}>
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
		bind:value={journalEntryInput.content}
		on:keydown={onKeyDown}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
