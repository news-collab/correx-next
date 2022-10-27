<script>
  import { reply } from '$lib/api';
  import { createEventDispatcher } from 'svelte';

  export let post;
  let replyValue = '';
  let waiting = false;
  const dispatch = createEventDispatcher();

  async function handleReply() {
    try {
      waiting = true;
      const newReplyResponse = await reply(post, replyValue);
      const newReply = await newReplyResponse.json();
      await dispatch('replyCreated', newReply);
    } catch (e) {
      console.error('could not create reply', e);
    }

    waiting = false;
    replyValue = '';
  }
</script>

<form>
  <div class="mb-3">
    <textarea
      class="form-control"
      id={`reply-post-${post.id}`}
      aria-describedby="replyHelp"
      bind:value={replyValue}
      disabled={waiting}
    />
    <div id="replyHelp" class="form-text">Reply to conversation.</div>
  </div>
  <button type="button" class="btn btn-primary" on:click={handleReply} disabled={waiting}
    >Reply</button
  >
</form>
