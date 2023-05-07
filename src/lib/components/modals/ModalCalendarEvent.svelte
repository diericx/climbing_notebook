<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { CalendarEvent } from '@prisma/client';
	let calendarEvent = $modalStore[0]?.meta?.data as CalendarEvent;
</script>

<div class="card w-modal">
	<header class="card-header">
		<h3 class="font-bold">Event</h3>
	</header>
	<section class="p-4">
		<h4>{calendarEvent.title}</h4>
		{#if calendarEvent?.content}
			<p class="whitespace-pre-wrap">{calendarEvent?.content}</p>
		{:else}
			<p class="italic text-gray-400">No content</p>
		{/if}
	</section>
	<footer class="card-footer float-right space-x-4">
		<button class="btn variant-ghost-surface" on:click={modalStore.close}>Cancel</button>
		<a href={`/calendarEvent/${calendarEvent?.id || undefined}/edit?redirectTo=/`}>
			<button class="btn variant-filled" on:click={modalStore.close}>Edit</button>
		</a>
	</footer>
</div>
