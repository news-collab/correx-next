import { goto } from '$app/navigation';

export function canUseAdmin(user) {
  return user && user.admin;
}

export async function guardAdminRoute(user) {
  if (!canUseAdmin(user)) {
    await goto('/');
  }
}
