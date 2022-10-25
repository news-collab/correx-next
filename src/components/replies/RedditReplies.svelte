<script>
  import ReplyForm from '@/components/replies/ReplyForm.svelte';
  import RedditReply from '@/components/replies/RedditReply.svelte';

  export let post;

  function handleNewReply(e) {
    const { detail: newReply } = e;
    console.log('new reply', newReply);
    const replies = [...post.replies, newReply];

    post = {
      ...post,
      replies
    };
  }
</script>

<div class="replies">
  {#each post.replies as reply}
    <RedditReply subjectId={post.subject_id} postId={post.id} {reply} />
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
