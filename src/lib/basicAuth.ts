import { env } from '$env/dynamic/private';

// Basic auth configuration
const AUTH_USERNAME = env.BASIC_AUTH_USERNAME || 'username';
const AUTH_PASSWORD = env.BASIC_AUTH_PASSWORD || 'password';

export function requireBasicAuth(authorization: string | null): boolean {
  if (!authorization) {
    return false;
  }

  if (!authorization.startsWith('Basic ')) {
    return false;
  }

  const encoded = authorization.slice(6); // Remove "Basic " prefix
  const decoded = Buffer.from(encoded, 'base64').toString();
  const [username, password] = decoded.split(':');

  return username === AUTH_USERNAME && password === AUTH_PASSWORD;
}

export function createBasicAuthResponse(): Response {
  return new Response('401 Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Discogs Collection - Authentication Required"',
      'Content-Type': 'text/plain'
    }
  });
}