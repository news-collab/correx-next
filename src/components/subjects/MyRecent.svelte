<script>
	import moment from 'moment';
	import { goto } from '$app/navigation';

	export let subjects = [];
	subjects = subjects.filter((word) => moment().diff(word.createdAt, 'days') < 8);
	async function handleSubjectClick(uuid) {
		await goto(`/subject/${uuid}`);
	}
</script>

<h2>Stories you are tracking</h2>

<table class="table recent-subjects">
	<thead>
		<tr>
			<th>Story</th>
		</tr>
	</thead>
	<tbody>
		{#each subjects as subject}
			<tr>
				<td class="subject">
					<div class="title text-truncate" on:click={handleSubjectClick(subject.uuid)}>
						{subject.metadata && subject.metadata.title ? subject.metadata.title : subject.url}
					</div>
					{#if subject.metadata && subject.metadata.title}
						<div class="text-truncate url">{subject.url}</div>
					{/if}
					<div class="subject-footer">
						<span class="submitted-at">
							{moment(subject.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
						</span>
						<span class="external-link">
							<a href={subject.url} target={subject.url}>open</a>
							<a href={subject.url} target={subject.url}><i class="bi bi-box-arrow-up-right" /> </a>
						</span>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	:global(table.recent-subjects) {
		table-layout: fixed;
	}

	td.subject {
		cursor: pointer;
	}

	.title {
		color: #0d6efd;
		font-weight: bold;
	}

	.submitted-footer {
		display: flex;
		font-size: 0.8em;
	}

	.external-link {
		display: none;
	}

	td.subject:hover .external-link {
		display: inline;
	}
</style>
