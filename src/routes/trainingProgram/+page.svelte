<script lang="ts">
	import { enhance } from '$app/forms';
	import type { TrainingProgramWithDays } from '$lib/prisma';
	import { confirmDelete } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;

	$: profile = data.profile;
	$: trainingPrograms = data.trainingPrograms as TrainingProgramWithDays[];
</script>

<div>
	<div>
		<div class="flex justify-between mb-2">
			<h1>Your Programs</h1>
			<div>
				<button
					class="btn btn-sm variant-filled"
					on:click={() =>
						modalStore.trigger({
							type: 'component',
							component: 'formModalTrainingProgram',
							meta: {
								action: `/trainingProgram?/new`,
								title: 'New Training Program'
							}
						})}
				>
					<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
					<span>New Program</span>
				</button>
			</div>
		</div>
		<hr />

		<div>
			{#if trainingPrograms.length == 0}
				<p class="text-gray-400 italic">You have no training programs.</p>
			{:else}
				<ul class="divide-y divide-gray-200 border">
					{#each trainingPrograms as p}
						<li class="bg-white py-4 px-6">
							<div class="flex items-center md:space-x-8">
								<div class="flex-1 min-w-0">
									<p>{p.name}</p>
									<p class="text-sm text-gray-400">
										{profile?.activeTrainingProgramId == p.id ? 'Active' : ''}
									</p>
								</div>
								<div class="flex items-center min-w-0 float-right space-x-2">
									<form method="POST" action={`/profile?/edit`} use:enhance>
										<input type="hidden" name="activeTrainingProgramId" value={p.id} />
										<button class="btn btn-sm variant-ringed" value="Set Active">
											Set Active
										</button>
									</form>
									<a class="btn btn-sm variant-ringed" href="/trainingProgram/{p.id}/edit">
										<Icon icon="material-symbols:edit-outline" height="18" />
										<span> Edit </span>
									</a>
									<form method="POST" action={`/trainingProgram/${p.id}?/delete`} use:enhance>
										<input type="hidden" name="id" value={p.id} />
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
		</div>
	</div>
</div>
