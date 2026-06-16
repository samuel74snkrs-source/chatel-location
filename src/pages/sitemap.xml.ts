import type { APIRoute } from 'astro';
import { getLogementsPublies } from '../lib/db';

// Sitemap genere dynamiquement : pages statiques + une URL par logement publie.
export const GET: APIRoute = async ({ locals, site }) => {
  const base = (site?.href ?? 'https://www.chatel-appartement.com/').replace(/\/$/, '');
  const DB = (locals as App.Locals).runtime.env.DB;
  const logements = await getLogementsPublies(DB);

  const urls = [
    { loc: `${base}/`, priority: '1.0' },
    { loc: `${base}/logements`, priority: '0.9' },
    { loc: `${base}/station`, priority: '0.6' },
    { loc: `${base}/contact`, priority: '0.5' },
    ...logements.map((l) => ({
      loc: `${base}/logements/${l.slug}`,
      priority: '0.8',
      lastmod: l.date_maj?.slice(0, 10),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${'lastmod' in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
