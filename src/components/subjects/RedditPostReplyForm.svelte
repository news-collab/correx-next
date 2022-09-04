<script>
	export let post;
	let replyValue = '';

	async function handleReply() {
		const path = `${import.meta.env.VITE_BASE_URL}/api/subjects/${post.subject_id}/posts/${
			post.id
		}/replies/reddit`;

		const createReplyResponse = await fetch(path, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reply: replyValue
			})
		});
		console.log('reply', createReplyResponse);
	}
</script>

<form>
	<div class="mb-3">
		<label for="reply" class="form-label">Reply</label>
		<textarea
			class="form-control"
			id={`reply-post-${post.id}`}
			aria-describedby="replyHelp"
			bind:value={replyValue}
		/>
		<div id="replyHelp" class="form-text">Reply to Reddit submission.</div>
	</div>
	<button type="button" class="btn btn-primary" on:click={handleReply}>Reply</button>
</form>
