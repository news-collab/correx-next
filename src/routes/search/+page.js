/** @type {import('./$types').PageLoad} */
export async function load() {
  const path = `${import.meta.env.VITE_BASE_URL}/api/subjects`;
  const response = await fetch(path, { credentials: 'include' });

  if (response.status == 200) {
    return {
      subjects: await response.json()
    };
  }

  return {
    subjects: []
  };
}
