import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  const path = `${import.meta.env.VITE_BASE_URL}/api/subjects/${params.subjectId}?platform=REDDIT`;

  try {
    const response = await fetch(path);
    const subject = await response.json();
    console.log(subject);
    return { subject };
  } catch (e) {
    throw error(404, 'could not find subject');
  }
}
