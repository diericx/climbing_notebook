<script lang="ts">
	import type { CalendarEvent, JournalEntry } from '@prisma/client';
	import Modal from '../Modal.svelte';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';

	export let showModal = false;
	export let calendarEvent: CalendarEvent | undefined = undefined;
</script>

<Modal bind:showModal>
	<h1>{calendarEvent?.title}</h1>
	{#if calendarEvent?.content}
		<p class="whitespace-pre-wrap">{calendarEvent?.content}</p>
	{:else}
		<p class="italic text-gray-400">No content</p>
	{/if}

	<div class="w-full" slot="buttons">
		<a href={`/calendarEvent/${calendarEvent?.id || undefined}/edit?redirectTo=/`}>
			<button class="inline-flex">Edit</button>
		</a>
		<form
			method="POST"
			action={`/calendarEvent/${calendarEvent?.id}/edit?/deleteCalendarEvent`}
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type == 'success') {
						await invalidateAll();
						showModal = false;
					}
				};
			}}
			class="inline-flex float-right"
		>
			<input type="hidden" name="id" value={calendarEvent?.id} />
			<button on:click={confirmDelete}>Delete</button>
		</form>
	</div>
</Modal>
