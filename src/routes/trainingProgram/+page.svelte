<script lang="ts">
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';
	import type { PageData, ActionData } from './$types';
	import WeeklyCalendar from './weekCalendar.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: profile = data.profile;
	$: trainingPrograms = data.trainingPrograms;
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div>
	<h1>Training Programs</h1>
	<br />

	<div class="pb-4">
		<h2>Your Active Training Program</h2>
		<hr />
		{#if profile.activeTrainingProgram}
			<WeeklyCalendar trainingProgram={profile.activeTrainingProgram} />
		{:else}
			<span class="text-gray-400"
				><i>You do not have an active training program! Create and set one below.</i></span
			>
		{/if}
	</div>

	<div>
		<h2>Your Training Programs</h2>
		<hr />
		<a href="/trainingProgram/new?redirectTo=/trainingProgram">New Training Program</a>

		<div>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Is Active</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each trainingPrograms as program}
						<tr>
							<td>{program.name}</td>
							<td>{profile.activeTrainingProgramId == program.id}</td>
							<td class="float-right">
								<form
									method="POST"
									action={`/profile/edit?/editProfile`}
									class="inline"
									use:enhance
								>
									<input type="hidden" name="activeTrainingProgramId" value={program.id} />
									<input type="submit" class="link-button" value="Set As Active" />
								</form>
								<a href="/trainingProgram/{program.id}/edit" class="button">Edit</a>
								<form
									method="POST"
									action={`/trainingProgram/${program.id}/edit?/deleteTrainingProgram`}
									class="inline"
									use:enhance
								>
									<input type="hidden" name="id" value={program.id} />
									<button on:click={confirmDelete}>Delete</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
