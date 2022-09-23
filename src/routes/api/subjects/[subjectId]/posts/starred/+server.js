import { error } from '@sveltejs/kit';
import { starredPosts } from '$lib/db';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
  const platform = url.searchParams.get('platform');

  try {
    const posts = await starredPosts(params.subjectId, platform);
    console.log('starred', posts)
    return new Response(JSON.stringify(posts));
  } catch (e) {
    return error(500, `could not get starred posts: ${e}`);
  }
}
