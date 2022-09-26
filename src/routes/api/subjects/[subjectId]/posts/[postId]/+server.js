import { error } from '@sveltejs/kit';
import { updatePost } from "$lib/db";

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, params }) {
  const post = await request.json();

  try {
    const updatedPost = await updatePost(post);
    return new Response(JSON.stringify(updatedPost));
  } catch (e) {
    console.error(e);
    throw error(500, `could not update post: ${e}`);
  }
}
