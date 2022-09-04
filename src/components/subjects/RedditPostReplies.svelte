<script>
	import moment from 'moment';
	import RedditPostReplyForm from '@/components/subjects/RedditPostReplyForm.svelte';
	import { JsonView } from '@zerodevx/svelte-json-view';
	import ReplySheet from '../Source/ReplySheet.svelte';

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
				<div class="replies">
					{#each post.replies as reply}
						<div class="reply">
							<div class="body">{reply.data.body}</div>
							<div class="created">
								{moment(reply.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}
							</div>
						</div>
					{/each}
				</div>
				<div class="accordion-body">
					<RedditPostReplyForm {post} />
				</div>
			</div>
		</div>
	{/each}
</div>
