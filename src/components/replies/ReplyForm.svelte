<script>
  import { reply } from '$lib/api';
  import { createEventDispatcher } from 'svelte';

  export let post;
  let replyValue = '';
  let waiting = false;
  let replyErrorMessage = '';
  const dispatch = createEventDispatcher();

  async function handleReply() {
    if (replyValue.length === 0) {
      replyErrorMessage = 'Cannot submit empty reply.';
      return;
    }

    try {
      waiting = true;
      const newReplyResponse = await reply(post, replyValue);

      if (newReplyResponse.ok) {
        replyErrorMessage = '';
        const newReply = await newReplyResponse.json();
        await dispatch('replyCreated', newReply);
      } else {
        console.error(`could not create reply, status: ${newReplyResponse.status}`);
        replyErrorMessage = `Could not create reply`;
      }
    } catch (e) {
      replyErrorMessage = 'Could not submit reply.';
      console.error('could not create reply', e);
    }

    waiting = false;
    replyValue = '';
  }
</script>

<form>
  {#if replyErrorMessage}
    <div class="alert alert-danger" role="alert">
      {replyErrorMessage}
    </div>
  {/if}
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
