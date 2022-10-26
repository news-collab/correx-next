import { getUserSession } from '$lib/session';
import { getReply, getUser } from '$lib/db';
import { error } from '@sveltejs/kit';
import { getTwitterReplies } from '$lib/twitter/twitterV2.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, request }) {
  const session = getUserSession(request.headers);
  const user = await getUser(session.user.id);

  if (!user) {
    throw error(403, 'login to get Twitter comments');
  }
  const reply = await getReply(params.replyId);

  if (!reply) {
    throw error(500, 'could not get Twitter replies');
  }

  let replies = [];
  const commentResponse = await getTwitterReplies(reply.platform_id, user);
  const last100 = await commentResponse.fetchLast(100);
  for await (const tweet of last100) {
    const author = commentResponse.includes.author(tweet);
    replies.push({
      author,
      tweet: tweet
    });
  };

  return new Response(JSON.stringify(replies));
}
