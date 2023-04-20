<script lang="ts">
	import { enhance } from '$app/forms';
	import type { TrainingProgramWithDays } from '$lib/prisma';
	import { confirmDelete } from '$lib/utils';
	import type { PageData, ActionData } from './$types';
	import WeeklyCalendar from './weekCalendar.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: profile = data.profile;
	$: trainingPrograms = data.trainingPrograms as TrainingProgramWithDays[];
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div>
	<div>
		<h1>Your Training Programs</h1>
		<hr />
		<a href="/trainingProgram/new?redirectTo=/trainingProgram">New Training Program</a>

		<div>
			<ul class="divide-y divide-gray-200 border-t border-r border-l shadow">
				{#each trainingPrograms as p}
					<li class="bg-white py-2 px-6">
						<div class="flex items-center md:space-x-8">
							<div class="flex-1 min-w-0">
								<p>{p.name}</p>
								<p class="text-sm text-gray-400">
									{profile?.activeTrainingProgramId == p.id ? 'Active' : ''}
								</p>
							</div>
							<div class="flex items-center min-w-0 float-right space-x-2">
								<form method="POST" action={`/profile/edit?/editProfile`} use:enhance>
									<input type="hidden" name="activeTrainingProgramId" value={p.id} />
									<input type="submit" class="link-button" value="Set As Active" />
								</form>
								<a href="/trainingProgram/{p.id}/edit">Edit</a>
								<form
									method="POST"
									action={`/trainingProgram/${p.id}/edit?/deleteTrainingProgram`}
									use:enhance
								>
									<input type="hidden" name="id" value={p.id} />
									<button on:click={confirmDelete}>Delete</button>
								</form>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
