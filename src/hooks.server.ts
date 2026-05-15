import type { Handle } from '@sveltejs/kit';
import { requireBasicAuth, createBasicAuthResponse } from '$lib/basicAuth';

const basicAuthHandle: Handle = async ({ event, resolve }) => {
  // Skip auth check for static assets
  if (event.url.pathname.startsWith('/_app/') ||
      event.url.pathname.startsWith('/favicon') ||
      event.url.pathname.endsWith('.css') ||
      event.url.pathname.endsWith('.js') ||
      event.url.pathname.endsWith('.png') ||
      event.url.pathname.endsWith('.svg')) {
    return resolve(event);
  }

  const authorization = event.request.headers.get('authorization');

  if (!requireBasicAuth(authorization)) {
    return createBasicAuthResponse();
  }

  return resolve(event);
};

export const handle: Handle = basicAuthHandle;