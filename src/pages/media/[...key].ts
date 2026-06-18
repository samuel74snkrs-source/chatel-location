import type { APIRoute } from 'astro';

// Sert les photos stockées dans R2 (bucket privé) via le Worker.
// URL publique : /media/<clé-objet-r2>. Le bucket reste privé ; rien n'est exposé directement.
export const GET: APIRoute = async ({ params, locals }) => {
  const env = (locals as App.Locals).runtime.env;
  const key = params.key;
  if (!env.PHOTOS) {
    return new Response('Stockage R2 non activé', { status: 503 });
  }
  if (!key) return new Response('Not found', { status: 404 });

  const objet = await env.PHOTOS.get(key);
  if (!objet) return new Response('Not found', { status: 404 });

  // On lit l'objet en mémoire et on récupère le type via une simple propriété.
  // (Ne PAS utiliser objet.writeHttpMetadata(headers) : passer un objet Headers
  // dans la méthode proxifiée fait échouer le proxy de dev — "non-POJO".)
  const buf = await objet.arrayBuffer();
  const contentType = objet.httpMetadata?.contentType || 'application/octet-stream';
  return new Response(buf, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
