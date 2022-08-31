<script>
	import { JsonView } from '@zerodevx/svelte-json-view'

	export let data;
	export let subjectId;
	export let subject = data.subject;
	export let posts = data.posts;

	console.debug("followup data:", data);
</script>

<h1>
	{(subject && subject.metadata && subject.metadata.title) || subject.url}
</h1>

<div class="posts">
{#each posts as post}
	<div class="post">
		<div class="id">{post.id}</div>
		<div class="title">{post.data.title}</div>
	</div>
{/each}
</div>


<h1>Subject</h1>
<JsonView json={subject} />
<h1>Posts</h1>
<JsonView json={posts} />
