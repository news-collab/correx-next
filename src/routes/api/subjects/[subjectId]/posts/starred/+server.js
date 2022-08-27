import { error } from '@sveltejs/kit';
import { starPosts, starredPosts } from "$lib/db";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const starredPostData = await request.json();
  console.log(`starredPostData`, starredPostData);

  try {
    const batchPayload = await starPosts(starredPostData.postIds);
    console.log(`updated ${batchPayload.count} posts`);
    const starredPostIds = await (await starredPosts(starredPostData.subjectid)).map(p => p.id);
    return new Response(JSON.stringify(starredPostIds));

  } catch (e) {
    return error(500, `could not star posts: ${e}`);
  }

}
