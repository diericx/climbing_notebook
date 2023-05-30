<script lang="ts">
	import { enhance } from '$app/forms';
	import ListExerciseEvent from '$lib/components/ListExerciseEvent.svelte';
	import ListMetric from '$lib/components/ListMetric.svelte';
	import { camelToTitle, confirmDelete } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
	$: query = data.query;
	$: exerciseEvents = data.exerciseEvents;
	$: metrics = data.metrics;
</script>

<div class="flex justify-between">
	<div>
		<h1>{query.name}</h1>
	</div>
	<div>
		<button
			class="btn btn-sm variant-ringed mb-1"
			on:click={() =>
				modalStore.trigger({
					type: 'component',
					component: 'formModalCustomQuery',
					meta: {
						action: `/query/${query.id}?/update`,
						title: 'Edit Query',
						data: query
					}
				})}
		>
			<Icon icon="material-symbols:edit-outline" height="18" />
			<span>Edit</span>
		</button>
	</div>
</div>

<hr />

<div>
	<div class="card p-4">
		<div>Table: <code class="code">{query.table}</code></div>
		<div>Operator: <code class="code">{query.operator}</code></div>
	</div>
</div>

<div class="flex items-center justify-between mt-10">
	<div>
		<h2>Query Conditions</h2>
	</div>
	<div>
		<button
			class="btn btn-sm variant-filled mb-1"
			on:click={() =>
				modalStore.trigger({
					type: 'component',
					component: 'formModalCustomQueryCondition',
					meta: {
						action: `/query/${query.id}?/addCondition`,
						title: 'Add Condition',
						query
					}
				})}
		>
			<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
			<span>Add Condition</span>
		</button>
	</div>
</div>
<hr />
{#if query.conditions.length == 0}
	<p class="italic text-gray-400">No query conditions</p>
{:else}
	<ul class="list">
		{#each query.conditions as condition}
			<li class="card bg-white py-3 px-2 md:px-4 mb-3">
				<div class="flex justify-between">
					<div class="flex items-center">
						<p>
							{camelToTitle(query.table)} <code class="code">{condition.column}</code>
							<br class="md:hidden" />
							{condition.condition}
							<br class="md:hidden" />
							<code class="code">{`"${condition.value}"`}</code>
						</p>
					</div>
					<div class="flex space-x-2">
						<div>
							<button
								class="btn btn-sm variant-ringed mb-1"
								on:click={() =>
									modalStore.trigger({
										type: 'component',
										component: 'formModalCustomQueryCondition',
										meta: {
											action: `/query/${query.id}/condition/${condition.id}?/update`,
											title: 'Edit Condition',
											data: condition,
											query
										}
									})}
							>
								<Icon icon="material-symbols:edit-outline" height="18" />
								<span>Edit</span>
							</button>
						</div>

						<form
							use:enhance
							method="POST"
							action={`/query/${query.id}/condition/${condition.id}?/delete`}
							class="flex-initial"
						>
							<button on:click={confirmDelete} class="btn btn-sm variant-ringed">
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

<div class="flex justify-between mt-10">
	<div>
		<h2>Query Results</h2>
	</div>
</div>
<hr />

<div>
	<h3 class="font-bold">Exercise Events</h3>
	<ListExerciseEvent {exerciseEvents} showActionBtns={false} />

	<h3 class="font-bold mt-5">Metrics</h3>
	<ListMetric {metrics} showActionBtns={false} />
</div>
