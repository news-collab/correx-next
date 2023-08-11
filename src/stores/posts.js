import { derived, writable } from 'svelte/store';

export const selectedPosts = writable([]);
export const sortedSelectedPosts = derived(selectedPosts, ($posts) => {
  console.log('selected', $posts)
  return [...$posts].sort((a, b) => { return b.data.score - a.data.score; });
})
