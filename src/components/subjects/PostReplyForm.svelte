<script>
  import { createReply } from '$lib/db';
  import { createEventDispatcher } from 'svelte';

  export let post;
  let replyValue = '';
  let waiting = false;
  const dispatch = createEventDispatcher();

  async function handleReply() {
    try {
      waiting = true;
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
      const newReply = await createReplyResponse.json();
      dispatch('replyCreated', newReply);
    } catch (e) {
      console.error('could not create reply', e);
    }

    waiting = false;
  }
</script>

<form>
  <div class="mb-3">
    <label for="reply" class="form-label">New Reply</label>
    <textarea
      class="form-control"
      id={`reply-post-${post.id}`}
      aria-describedby="replyHelp"
      bind:value={replyValue}
      disabled={waiting}
    />
    <div id="replyHelp" class="form-text">Reply to post.</div>
  </div>
  <button type="button" class="btn btn-primary" on:click={handleReply} disabled={waiting}
    >Reply</button
  >
</form>
