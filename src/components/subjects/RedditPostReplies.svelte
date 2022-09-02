<script>
	import RedditPostReplyForm from '@/components/subjects/RedditPostReplyForm.svelte';

	export let posts = [];
</script>

<div class="accordion open" id="post-accordian">
	{#each posts as post}
		<div class="accordion-item">
			<h2 class="accordion-header" id={`post-header-${post.id}`}>
				<button
					class="accordion-button collapsed"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target={`#post-${post.id}`}
					aria-expanded="false"
					aria-controls={`post-${post.id}`}
				>
					{post.data.title}
				</button>
			</h2>
			<div
				id={`post-${post.id}`}
				class="accordion-collapse collapse"
				aria-labelledby={`post-header-${post.id}`}
				data-bs-parent="#post-accordian"
			>
				<div class="accordion-body">
					<RedditPostReplyForm post={post.id} />
				</div>
			</div>
		</div>
	{/each}
</div>
