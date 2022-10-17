<script>
    import moment from 'moment';
    import { getRedditReplies } from '@/lib/api';

    export let subjectId;
    export let postId;
    export let reply = {};

    let replyComments = [];

    $: (async () => {
        const replyCommentsResponse = await getRedditReplies(subjectId, postId, reply.id);
        replyComments = await replyCommentsResponse.json();
        console.log('reply comments', replyComments)
    })()
</script>

<div class="reply">
    <div class="header">
        <p>
            <span class="author">{reply.author.reddit_username}</span>
            wrote on
            <span class="created">
                {moment(reply.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}
            </span>
        </p>
    </div>
    <div class="body"><p>{reply.data.body}</p></div>
</div>

{#if replyComments.length > 0}
<div class="reddit-comment-replies">
    {#each replyComments as comment}
        <div class="header">
            <p>
                <span class="author">{comment.author.name}</span>
                wrote on
                <span class="created">
                {moment(comment.created_utc).format('dddd, MMMM Do YYYY, h:mm:ss a')}
            </span>
            </p>
        </div>
        <div class="body"><p>{@html comment.body_html}</p></div>
    {/each}
</div>
{/if}