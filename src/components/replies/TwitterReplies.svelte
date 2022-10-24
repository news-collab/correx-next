<script>
  import moment from 'moment';
  import { Circle2 } from 'svelte-loading-spinners';
  import ReplyForm from '@/components/replies/ReplyForm.svelte';
  import { getConversation } from '$lib/api';
  import { getTwitterReplies } from '@/lib/api';

  export let subjectId;
  export let postId;
  export let reply = {};
  let loading = true;

  let replyComments = [];

  function updateReplyComments(comments) {
    replyComments = comments;
  }

  $: (async () => {
    loading = true;
    console.log('twitter reply changes', subjectId, postId, reply.id);
    const replyCommentsResponse = await getRedditReplies(subjectId, postId, reply.id);
    updateReplyComments(await replyCommentsResponse.json());
    loading = false;
  })();
</script>

<div class="replies">
  {#each post.replies as reply}
    <div class="reply">
      <div class="header">
        <p>
          <span class="author">{reply.data.author_username}</span>
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
