<script>
    import moment from 'moment';
    import { getRedditReplies } from '@/lib/api';

    export let subjectId;
    export let postId;
    export let reply = {};

    let replyComments = [];
</script>

<div class="reply">
    <div class="header">
        <p>
            <span class="author">{reply.author.name}</span>
            wrote on
            <span class="created">
                {moment(reply.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}
            </span>
        </p>
    </div>
    <div class="body"><p>{reply.data.body}</p></div>
</div>