import { goto } from '$app/navigation';
import { browser } from '$app/env';

export function canUseAdmin(user) {
  return user && user.admin;
}

export async function guardAdminRoute(user) {
  $: if (browser) {
    if (!canUseAdmin(user)) {
      await goto('/');
    }
  }
}
