import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? 'https://www.chatel-appartement.com/').replace(/\/$/, '');
  const body = `User-agent: *
Allow: /
Disallow: /contact
Disallow: /admin

Sitemap: ${base}/sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
