<script lang="ts">
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	function confirmDelete(e: MouseEvent) {
		if (!confirm('Are you sure you want to delete this exercise?')) {
			e.preventDefault();
		}
	}
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div>
	<h1>Training Programs</h1>
	<hr />
	<br />

	<a href="/trainingPrograms/new">New Training Program</a>

	<div>
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#each data.trainingPrograms as item}
					<tr>
						<td>{item.name}</td>
						<td>
							<form method="POST" action="?/delete" class="inline">
								<input type="hidden" name="id" value={item.id} />
								<button formaction="?/delete" on:click={confirmDelete}>Delete</button>
							</form>
							<a href="/trainingProgram/{item.id}">Show</a>
							<a href="/trainingProgram/{item.id}/edit?redirectTo=/trainingLog">Edit</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
