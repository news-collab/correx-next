<script>
	import BreadCrumbs from '@/components/Source/Breadcrumbs.svelte';
	import PostSelector from '@/components/subjects/PostSelector.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const { subject } = data;
	const { posts } = subject;

	async function saveSelection(item) {
		const post = item.item.post;
		post.starred = item.checked;
		const postEndpoint = `/api/subjects/${source_id}/followup/posts.json`;
		const response = await fetch(postEndpoint, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ posts: [post] })
		});
		const saved = await response.json();
	}
</script>

<h1>
	{(subject && subject.metadata && subject.metadata.title) || subject.url}
</h1>

<BreadCrumbs id={subject.id} active={'results'} />

<PostSelector subjectId={subject.id} {posts} />
