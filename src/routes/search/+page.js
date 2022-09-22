/** @type {import('./$types').PageLoad} */
export async function load() {
  const path = `${import.meta.env.VITE_BASE_URL}/api/subjects`;
  const response = await fetch(path, { credentials: 'include' });

  if (response.ok) {
    const subjects = await response.json();

    return {
      subjects
    };
  }

  return {
    subjects: []
  };
}
