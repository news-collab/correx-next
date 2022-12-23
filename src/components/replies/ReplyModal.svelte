<script>
  import { platform } from '@prisma/client';
  import ReplyForm from '@/components/replies/ReplyForm.svelte';
  import TwitterReplies from '@/components/replies/TwitterReplies.svelte';
  import RedditReplies from '@/components/replies/RedditReplies.svelte';

  export let post = {};
</script>

<div id="reply_modal" class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Followup</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
      </div>
      <div class="modal-body">
        {#if post.platform === 'TWITTER'}
          <TwitterReplies {post} />
        {:else if post.platform === 'REDDIT'}
          <RedditReplies {post} />
        {/if}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-body {
  }
</style>
