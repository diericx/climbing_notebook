<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';

	import JournalEntryForm from '../../form.svelte';
	import { JournalEntryFormData } from '$lib/journalEntry';

	export let data: PageData;
	export let form: ActionData;

	// Either grab form data from the Sveltekit form obj,
	// or generate a new one from incoming page data
	const journalEntryFormData: JournalEntryFormData =
		(form?.journalEntryFormData as JournalEntryFormData) ||
		JournalEntryFormData.fromObject(data?.journalEntry);

	let redirectTo = form?.redirectTo || data.redirectTo || '';
</script>

{#if form?.message}<p class="server-message {$page.status == 200 ? 'success' : 'error'}">
		{form?.message}
	</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>Edit Journal Entry</h2>
		<JournalEntryForm action="?/editJournalEntry" {redirectTo} {journalEntryFormData} />
	</div>
</div>
