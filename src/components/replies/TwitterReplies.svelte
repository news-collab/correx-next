<script>
  import moment from 'moment';
  import ReplyForm from '@/components/replies/ReplyForm.svelte';
  import { getConversation } from '$lib/api';

  export let post;
  let replies = [];

  $: {
    getConversation(post.subject_id, post.id).then((resp) =>
      resp.json().then((json) => (replies = json))
    );
  }

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
          <span class="author">{reply.author.twitter_username}</span>
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
