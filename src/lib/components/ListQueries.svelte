<script lang="ts">
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { CustomQuery } from '@prisma/client';

	export let queries: CustomQuery[];
</script>

{#if queries.length == 0}
	<span class="italic text-gray-400">No Queries</span>
{:else}
	<ul class="divide-y divide-gray-200 border">
		{#each queries as query}
			<li class="bg-white py-2 px-2 md:px-4">
				<div class="flex items-center md:space-x-3">
					<div class="flex-1 min-w-0">
						<p>{query.name}</p>
						<p class="text-sm text-gray-400">
							{query.table}
						</p>
					</div>
					<div class="flex min-w-0 float-right space-x-2">
						<div>
							<a class="btn btn-sm variant-ringed" href={`/query/${query.id}`}>Show</a>
						</div>
						<form class="inline" use:enhance method="POST" action={`/query/${query.id}?/delete`}>
							<button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
								<Icon icon="mdi:trash-outline" height="18" />
								<span class="ml-1 mr-1"> Delete </span>
							</button>
						</form>
					</div>
				</div>
			</li>
		{/each}
	</ul>
{/if}
