import type { APIRoute } from 'astro';
import { detruireSession, cookieDeconnexion } from '../../lib/auth';

export const GET: APIRoute = async ({ locals, request, url }) => {
  const env = (locals as App.Locals).runtime.env;
  await detruireSession(env.SESSION, request);
  const secure = url.protocol === 'https:';
  return new Response(null, {
    status: 302,
    headers: { Location: '/espace/connexion', 'Set-Cookie': cookieDeconnexion(secure) },
  });
};
