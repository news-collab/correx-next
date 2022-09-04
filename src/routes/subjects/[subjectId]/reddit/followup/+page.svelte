<script>
	import RedditPostReplies from '@/components/subjects/RedditPostReplies.svelte';
	export let data;
	export let subjectId;
	export let subject = data.subject;
	export let posts = data.posts;

	//console.debug('followup data:', data);
</script>

<h1>
	{(subject && subject.metadata && subject.metadata.title) || subject.url}
</h1>

<div class="posts">
	<RedditPostReplies {posts} />
</div>
