import { error } from '@sveltejs/kit';

/** @type {import('../../../../../../.svelte-kit/types/src/routes/subjects/[subjectId]/reddit/followup/$types').PageLoad} */
export async function load({ params, fetch }) {
  const subjectPath = `${import.meta.env.VITE_BASE_URL}/api/subjects/${params.subjectId}`;
  const starredPostsPath = `${import.meta.env.VITE_BASE_URL}/api/subjects/${params.subjectId}/posts/starred`;

  try {
    const subjectResponse = await fetch(subjectPath);
    const subject = await subjectResponse.json();

    const starredPostsResponse = await fetch(starredPostsPath);
    console.log('starredposts', starredPostsResponse);
    const posts = await starredPostsResponse.json();
    console.debug('data', { subject, posts })
    return { subject, posts };
  } catch (e) {
    console.error('could not get starred posts', e)
    throw error(500, 'could not get starred posts');
  }
}
