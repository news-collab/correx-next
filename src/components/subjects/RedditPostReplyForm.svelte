<script>
	export let post;
</script>

<form>
	<div class="mb-3">
		<label for="reply" class="form-label">Reply</label>
		<textarea class="form-control" id={`reply-post-${post.id}`} aria-describedby="replyHelp" />
		<div id="replyHelp" class="form-text">Reply to Reddit submission.</div>
	</div>
	<button type="submit" class="btn btn-primary">Reply</button>
</form>
