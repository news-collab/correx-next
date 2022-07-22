import { writable } from 'svelte/store';

let enableTweeting = writable(false);

export default enableTweeting;