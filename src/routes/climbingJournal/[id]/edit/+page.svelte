<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';

	import JournalEntryForm from '../../form.svelte';
	import { JournalEntryInput } from '$lib/journalEntry';

	export let data: PageData;
	export let form: ActionData;
	const journalEntryInput: JournalEntryInput =
		(form?.journalEntry as JournalEntryInput) ||
		(data?.journalEntry as JournalEntryInput) ||
		new JournalEntryInput();
	let redirectTo = form?.redirectTo || data.redirectTo || '';
</script>

{#if form?.message}<p class="server-message {$page.status == 200 ? 'success' : 'error'}">
		{form?.message}
	</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>Edit Journal Entry</h2>
		<JournalEntryForm action="?/edit" {redirectTo} {journalEntryInput} />
	</div>
</div>
