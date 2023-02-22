<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';

	import JournalEntryForm from '../../form.svelte';
	import { JournalEntryFormData } from '$lib/journalEntry';

	export let data: PageData;
	export let form: ActionData;
	const journalEntryFormData: JournalEntryFormData =
		(form?.journalEntry as JournalEntryFormData) ||
		(data?.journalEntry as JournalEntryFormData) ||
		new JournalEntryFormData();
	let redirectTo = form?.redirectTo || data.redirectTo || '';
</script>

{#if form?.message}<p class="server-message {$page.status == 200 ? 'success' : 'error'}">
		{form?.message}
	</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>Edit Journal Entry</h2>
		<JournalEntryForm action="?/edit" {redirectTo} {journalEntryFormData} />
	</div>
</div>
