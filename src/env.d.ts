/// <reference path="../.astro/types.d.ts" />

// Typage des bindings Cloudflare exposes dans Astro.locals.runtime.env.
type CloudflareEnv = {
  DB: import('@cloudflare/workers-types').D1Database;
  SESSION: import('@cloudflare/workers-types').KVNamespace;
  // R2 active ulterieurement (upload photos). Optionnel tant que non active.
  PHOTOS?: import('@cloudflare/workers-types').R2Bucket;
  ENVIRONMENT: string;
};

type Runtime = import('@astrojs/cloudflare').Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {
    // Propprietaire/admin connecte (rempli par le middleware d'auth en phase back-office).
    user?: {
      id: number;
      nom: string;
      prenom: string;
      email: string;
      role: 'proprietaire' | 'admin';
    };
  }
}
