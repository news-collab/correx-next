/** @type {import('@sveltejs/kit').Handle} */
import { appAuth } from "$lib/auth/auth";
import { session } from "$app/stores";

export const handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  return response;
};

export const { getSession } = appAuth;
