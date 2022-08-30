import { error } from '@sveltejs/kit';
import { updatePost } from "$lib/db";

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, params }) {
  const post = await request.json();
  console.log(`post`, post);
  console.log("params", params)

  try {
    const updatedPost = await updatePost(post);
    console.debug("updated post", updatedPost)
    return new Response(JSON.stringify(updatedPost));
  } catch (e) {
    console.error(e);
    return error(500, `could not update post: ${e}`);
  }
}
