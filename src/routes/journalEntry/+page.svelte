<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import JournalEntryForm from './form.svelte';
	import { JournalEntryFormData } from '$lib/journalEntry';
	import { confirmDelete } from '$lib/utils';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;
	const journalEntryFormData: JournalEntryFormData =
		(form?.journalEntryFormData as JournalEntryFormData) || new JournalEntryFormData();
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<h1>Journal</h1>

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>New Journal Entry</h2>
		<hr />
		<JournalEntryForm {journalEntryFormData} />
	</div>
</div>

<div class="pt-8">
	<h2>Your Entries</h2>
	<hr />

	<div>
		{#each data.journalEntries as item}
			<div class="flex justify-between">
				<div class="w-full pb-5">
					<h3 class="underline inline">{new Date(item.date).toLocaleDateString('en-US')}</h3>
					<form method="POST" action="?/deleteJournalEntry" class="inline" use:enhance>
						<input type="hidden" name="id" value={item.id} />
						<button on:click={confirmDelete}>Delete</button>
					</form>
					<a href="/journalEntry/{item.id}/edit?redirectTo=/journalEntry">Edit</a>
					<p class="whitespace-pre bg-white w-full px-1 py-3">{item.content}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
