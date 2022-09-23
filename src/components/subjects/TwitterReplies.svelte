<script>
  import moment from 'moment';
  import PostReplyForm from '@/components/subjects/PostReplyForm.svelte';

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
    <div class="reply">
      <div class="header">
        <p>
          <span class="author">{reply.data.author}</span>
          wrote on
          <span class="created">
            {moment(reply.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}
          </span>
        </p>
      </div>
      <div class="body"><p>{reply.data.body}</p></div>
    </div>
  {/each}
</div>

<PostReplyForm {post} on:replyCreated={handleNewReply} />

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
