<script>
  import ReplyForm from '@/components/replies/ReplyForm.svelte';
  import TwitterReply from '@/components/replies/TwitterReply.svelte';

  export let post;

  function handleNewReply(e) {
    const { detail: newReply } = e;
    const replies = [...post.replies, newReply];

    post = {
      ...post,
      replies
    };
  }
</script>

<div class="replies">
  {#each post.replies as reply}
    <TwitterReply subjectId={post.subject_id} {post} {reply} />
  {/each}
</div>

<ReplyForm {post} on:replyCreated={handleNewReply} />

<style>
  .replies {
    margin-bottom: 10px;
  }

  .reply {
    border-bottom: 1px solid rgb(38, 38, 38);
  }

  .reply .header {
    display: flex;
  }

  .author {
    font-weight: bold;
  }

  .created {
    font-size: 0.9em;
  }
</style>
