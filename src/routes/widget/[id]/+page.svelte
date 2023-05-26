<script lang="ts">
	import { enhance } from '$app/forms';
	import { camelToTitle, confirmDelete } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
	$: widget = data.widget;
	$: customQueries = data.customQueries;
	$: trainingPrograms = data.trainingPrograms;
</script>

<div class="flex justify-between">
	<div>
		<h1>{widget.name}</h1>
	</div>
	<div class="mb-1">
		<button
			class="btn btn-sm variant-ringed"
			on:click={() =>
				modalStore.trigger({
					type: 'component',
					component: 'formModalWidget',
					meta: {
						action: `/widget/${widget.id}?/update`,
						title: 'Add Widget',
						data: widget,
						showType: false,
						trainingPrograms
					}
				})}
		>
			<Icon icon="material-symbols:edit-outline" height="18" />
			<span>Edit</span>
		</button>
	</div>
</div>
<hr />

<div class="mb-8">
	<p><b>Width:</b> {widget.width}</p>
	<p><b>Order:</b> {widget.order}</p>
	<p><b>Type:</b> {camelToTitle(widget.type)}</p>
	<p><b>Training Program:</b> {widget.trainingProgram.name}</p>
</div>

{#if widget.type == 'chart' || widget.type == 'heatmapCalendar'}
	<div class="flex justify-between">
		<div>
			<h2>Datasets</h2>
		</div>
		<div>
			<button
				class="btn btn-sm variant-filled mb-1"
				on:click={() =>
					modalStore.trigger({
						type: 'component',
						component: 'formModalDataset',
						meta: {
							action: `/widget/${widget.id}?/addDataset`,
							title: 'Add Dataset',
							customQueries,
							showType: widget.type != 'heatmapCalendar',
							showColor: widget.type != 'heatmapCalendar',
							showEquation: widget.type != 'heatmapCalendar'
						}
					})}
			>
				<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
				<span>Add Dataset</span>
			</button>
		</div>
	</div>
	<hr />

	{#if widget.datasets.length == 0}
		<p class="text-gray-400 italic">No Datasets</p>
	{:else}
		<ul class="divide-y divide-gray-200 border">
			{#each widget.datasets as dataset}
				<li class="bg-white py-4 px-4 md:px-6">
					<div class="flex items-center space-x-2 md:space-x-4">
						{#if dataset.color != undefined && dataset.color != ''}
							<span class="w-8 h-8 rounded-full" style={`background-color: ${dataset.color}`} />
						{/if}
						<div class="flex-1 min-w-0">
							<p class="font-bold">{dataset.name}</p>
						</div>
						<div class="flex items-center min-w-0 float-right space-x-2">
							<button
								class="btn btn-sm variant-ringed"
								on:click={() =>
									modalStore.trigger({
										type: 'component',
										component: 'formModalDataset',
										meta: {
											action: `/widget/${widget.id}/dataset/${dataset.id}?/update`,
											title: 'Edit Dataset',
											customQueries,
											data: dataset,
											showType: widget.type != 'heatmapCalendar',
											showColor: widget.type != 'heatmapCalendar',
											showEquation: widget.type != 'heatmapCalendar'
										}
									})}
							>
								<Icon icon="material-symbols:edit-outline" height="18" />
								<span>Edit</span>
							</button>
							<form
								method="POST"
								action={`/widget/${widget.id}/dataset/${dataset.id}?/delete`}
								use:enhance
							>
								<button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
									<Icon icon="mdi:trash-outline" height="18" />
									<span> Delete </span>
								</button>
							</form>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
{/if}
