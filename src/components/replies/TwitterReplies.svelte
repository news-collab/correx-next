<script>
  import moment from 'moment';

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

<div class="post">
  <div class="card-title">
    <div class="author">
      <a href="https://www.twitter.com/{post.data.user.screen_name}" target="author_{post.id}"
        >{post.data.user.screen_name}</a
      >
      <a
        href={`https://twitter.com/${post.data.user.screen_name}/status/${post.platform_id}`}
        target="twitter_${post.platform_id}">tweeted</a
      >
      on
      <div class="created">
        {moment.parseZone(post.data.created_at).format('MMMM Do YYYY, h:mm:ss a')}
      </div>
    </div>
  </div>
  <div class="card-text">
    {post.data.text}
  </div>
</div>

<div class="replies">
  {#each post.replies as reply}
    <TwitterReply subjectId={post.subject_id} {post} {reply} />
  {/each}
</div>

<ReplyForm {post} on:replyCreated={handleNewReply} />

<style>
  .post {
    margin-bottom: 10px;
  }
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
