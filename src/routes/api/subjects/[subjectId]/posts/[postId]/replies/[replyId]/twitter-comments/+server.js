import { getUserSession } from '$lib/session';
import { getReply, getUser } from '$lib/db';
import { error } from '@sveltejs/kit';
import { getConversation } from '$lib/twitter/twitterV2.js';

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
  const commentResponse = await getConversation(reply.platform_id, user);
  const last100 = await commentResponse.fetchLast(100);
  console.log('reply id', reply.platform_id);
  console.log('last100', last100);
  for await (const tweet of last100) {
    console.log('tweet', tweet);
    replies.push(tweet);
  };
  /*if (commentResponse.length) {
    replies = commentResponse;
  } else {
    replies = [commentResponse];
  }*/
  //console.log('replies', replies);
  return new Response(JSON.stringify(replies));
}
