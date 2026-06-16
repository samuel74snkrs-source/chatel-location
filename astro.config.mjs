// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Plateforme de reservation directe — Chatel (Portes du Soleil)
// Rendu cote serveur (SSR) sur Cloudflare Workers : indispensable pour le SEO
// (HTML rendu serveur, meta dynamiques par logement) et la reservation temps reel.
export default defineConfig({
  // URL de production (a adapter au domaine reel). Sert au sitemap et aux URLs canoniques.
  site: 'https://www.chatel-appartement.com',

  // SSR complet : chaque page est rendue a la demande sur Cloudflare.
  output: 'server',

  adapter: cloudflare({
    // Expose les bindings Cloudflare (D1, R2, KV) en local pendant `astro dev`
    // via Miniflare, en lisant wrangler.toml. Permet de developper sans deployer.
    platformProxy: {
      enabled: true,
    },
    imageService: 'compile',
  }),

  // Architecture prete pour le multilingue (FR par defaut, EN en phase 2).
  // Les textes d'interface passent par un dictionnaire (src/i18n), jamais codes en dur.
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    ssr: {
      // Evite que Vite tente d'externaliser certains modules en SSR Cloudflare.
      external: ['node:async_hooks'],
    },
  },
});
