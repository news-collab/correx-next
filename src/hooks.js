/** @type {import('@sveltejs/kit').Handle} */
import { appAuth } from "$lib/auth";

export const handle = async ({ event, resolve }) => {
  // TODO https://github.com/sveltejs/kit/issues/1046

  // if (event.request.query.has("_method")) {
  //   event.request.method = event.request.query.get("_method").toUpperCase();
  // }

  const response = await resolve(event);

  return response;
};

export const { getSession } = appAuth;
