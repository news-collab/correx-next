<script>
	export let posts = [];
</script>

<table class="table">
	<thead>
		<tr>
			<th scope="col">title</th>
			<th scope="col">comments</th>
			<th scope="col">author</th>
			<th scope="col">created</th>
		</tr>
	</thead>
	<tbody>
		{#each posts as post}
			<tr>
				<th scope="row">{post.data.title}</th>
				<td>{post.data.num_comments}</td>
				<td>{post.data.author.name}</td>
				<td>{post.created_at}</td>
			</tr>
		{/each}
	</tbody>
</table>
