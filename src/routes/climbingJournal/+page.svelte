<script lang="ts">
	import type { PageData, ActionData } from './$types';

	import JournalEntryForm from './form.svelte';
	import { JournalEntryFormData } from '$lib/journalEntry';

	export let data: PageData;
	export let form: ActionData;
	const journalEntryFormData: JournalEntryFormData =
		(form?.journalEntryFormData as JournalEntryFormData) || new JournalEntryFormData();

	function confirmDelete(e: MouseEvent) {
		if (!confirm('Are you sure you want to delete this journal entry?')) {
			e.preventDefault();
		}
	}
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>New Journal Entry</h2>
		<JournalEntryForm {journalEntryFormData} />
	</div>
</div>

<div class="pt-8">
	<h2>Climbing Journal Entries</h2>
	<hr />
	<br />

	<div>
		{#each data.journalEntries as item}
			<div class="flex justify-between">
				<div class="w-full pb-5">
					<h3 class="underline inline">{new Date(item.date).toLocaleDateString('en-US')}</h3>
					<form method="POST" action="?/delete" class="inline">
						<input type="hidden" name="id" value={item.id} />
						<button formaction="?/delete" on:click={confirmDelete}>Delete</button>
					</form>
					<a href="/climbingJournal/{item.id}/edit?redirectTo=/climbingJournal">Edit</a>
					<p class="whitespace-pre bg-white w-full px-1 py-3">{item.content}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
