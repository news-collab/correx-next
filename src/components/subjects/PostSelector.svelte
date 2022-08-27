<script>
	import FaExternalLinkAlt from 'svelte-icons/fa/FaExternalLinkAlt.svelte';

	export let posts = [];
	// Sort posts by score.
	posts.sort((a, b) => b.data.score - a.data.score);

	// Selected posts.
	let selected = [];

	// Handle selection of a post.
	function handlePostSelect(postId) {
		console.debug(`post selected`, postId);
		const index = selected.findIndex((p) => p === postId);
		if (index !== -1) {
			selected.splice(index, 1);
		} else {
			selected.push(postId);
		}

		selected = [...selected];
	}
</script>

<table class="table">
	<thead>
		<tr>
			<th scope="col" />
			<th scope="col">submission title</th>
			<th scope="col">score</th>
			<th scope="col">comments</th>
			<th scope="col">author</th>
			<th scope="col">created</th>
		</tr>
	</thead>
	<tbody>
		{#each posts as post}
			<tr on:click={handlePostSelect(post.id)}>
				<th><input type="checkbox" checked={selected.indexOf(post.id) !== -1} /></th>
				<th scope="row" class="submission-title"
					>{post.data.title}
					<a class="permalink" href={`https://reddit.com${post.data.permalink}`} target={post.id}
						><div class="icon"><FaExternalLinkAlt /></div></a
					></th
				>
				<td>{post.data.score}</td>
				<td>{post.data.num_comments}</td>
				<td>{post.data.author.name}</td>
				<td>{post.created_at}</td>
			</tr>
		{/each}
	</tbody>
</table>

selected: {selected}

<style>
	.submission-title {
	}
	.icon {
		display: inline-block;
		width: 12px;
	}
</style>
