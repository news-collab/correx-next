import { error } from '@sveltejs/kit';
import { starredPosts } from '$lib/db';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  try {
    const posts = await starredPosts(params.subjectId);
    return new Response(JSON.stringify(posts));
  } catch (e) {
    return error(500, `could not get starred posts: ${e}`);
  }
}
