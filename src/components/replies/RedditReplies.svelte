<script>
  import moment from 'moment';

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

<div class="post">
  <div class="card-title">
    <div class="author">
      <a href="https://www.reddit.com/u/{post.data.author.name}" target="author_{post.id}"
        >{post.data.author.name}</a
      >
      <a href={`https://reddit.com/${post.data.permalink}`} target="reddit_${post.platform_id}"
        >wrote</a
      >
      on
      <div class="created">
        {moment.parseZone(post.data.created_at).format('MMMM Do YYYY, h:mm:ss a')}
      </div>
    </div>
  </div>
  <div class="card-text">
    {post.data.title}
  </div>
</div>

<div class="replies">
  {#each post.replies as reply}
    <RedditReply subjectId={post.subject_id} postId={post.id} {reply} />
  {/each}
</div>

<ReplyForm {post} on:replyCreated={handleNewReply} />

<style>
  .post {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dee2e6;
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
