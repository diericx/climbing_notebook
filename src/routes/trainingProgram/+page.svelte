<script lang="ts">
	import { enhance } from '$app/forms';
	import type { TrainingProgramWithDays } from '$lib/prisma';
	import { confirmDelete } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import {
		clipboard,
		ListBox,
		ListBoxItem,
		modalStore,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;

	$: profile = data.profile;
	$: trainingPrograms = data.trainingPrograms as TrainingProgramWithDays[];

	const popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
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
				<ul class="list clickable-list">
					{#each trainingPrograms as p}
						<li class="card bg-white pr-6 hover:bg-primary-50">
							<div class="flex items-center md:space-x-8">
								<a class="flex-1 hover:bg-transparent" href={`/trainingProgram/${p.id}/edit`}>
									<div class="flex-1 min-w-0 py-3 pl-6">
										<p>{p.name}</p>
										<p class="text-sm text-gray-400">
											{profile?.activeTrainingProgramId == p.id ? 'Active' : ''}
										</p>
									</div>
								</a>
								<div class="flex items-center min-w-0 float-right space-x-2">
									{#if profile?.activeTrainingProgramId != p.id}
										<form method="POST" action={`/profile?/edit`} use:enhance>
											<input type="hidden" name="activeTrainingProgramId" value={p.id} />
											<button class="btn btn-sm variant-ringed justify-start" value="Set Active">
												Set Active
											</button>
										</form>
									{/if}
									<div>
										<button
											class="btn !bg-transparent justify-between"
											use:popup={{
												event: 'focus-click',
												target: p.id.toString(),
												placement: 'bottom-end'
											}}
										>
											<Icon icon="fe:elipsis-h" height="18" />
										</button>
										<div
											id={p.id.toString()}
											class="card shadow-xl py-2"
											data-popup={p.id.toString()}
										>
											<nav class="list-nav">
												<ul>
													<li>
														<button
															class="btn btn-sm w-full justify-start"
															on:click={() =>
																modalStore.trigger({
																	type: 'component',
																	component: 'modalShareTrainingProgram',
																	meta: {
																		trainingProgram: p
																	}
																})}
														>
															<span>Share</span>
														</button>
													</li>
													<li>
														<a class="btn btn-sm justify-start" href="/trainingProgram/{p.id}/edit">
															<span> Edit </span>
														</a>
													</li>
													<li>
														<form
															method="POST"
															action={`/trainingProgram/${p.id}?/duplicate&redirectTo=/trainingProgram`}
														>
															<button class="btn btn-sm w-full justify-start" value="Set Active">
																Duplicate
															</button>
														</form>
													</li>
													<li>
														<form
															method="POST"
															action={`/trainingProgram/${p.id}?/delete`}
															use:enhance
														>
															<input type="hidden" name="id" value={p.id} />
															<button
																class="btn btn-sm w-full justify-start"
																on:click={confirmDelete}
															>
																<span> Delete </span>
															</button>
														</form>
													</li>
												</ul>
											</nav>
											<div class="arrow bg-surface-100-800-token" />
										</div>
									</div>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>
