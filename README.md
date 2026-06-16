# Pensée des Alpes — Plateforme de réservation directe

Site de location de vacances en **réservation directe** pour le chalet *Pensée des Alpes*
à **Châtel** (Haute-Savoie, Portes du Soleil). Démarré pour les logements de la famille
Grillet-Aubert, conçu pour évoluer en plateforme **multi-propriétaires**.

Cahier des charges : `../CAHIER_DES_CHARGES_plateforme_location_directe.md`.

## Stack

- **Astro** en mode SSR (rendu serveur, indispensable pour le SEO).
- **Cloudflare** : Workers (exécution), **D1** (base SQLite), **R2** (photos), **KV** (sessions), Cron (synchro iCal).
- i18n FR par défaut, EN prête (dictionnaire `src/i18n/ui.ts`, aucun texte codé en dur).

## Prérequis

Node.js 20+ et npm. (Sur la machine de dev, Node est installé en portable dans
`%LOCALAPPDATA%\nodejs-portable` — penser à l'ajouter au PATH.)

```bash
npm install
```

## Développement local

La base D1 et les bindings tournent en local via Miniflare (platformProxy).

```bash
npm run db:reset:local   # applique le schéma + les données de test (3 appartements)
npm run dev              # serveur de dev sur http://localhost:4321
```

> Après un re-seed, **redémarrer `npm run dev`** : Miniflare garde la base ouverte
> et ne voit pas les changements faits à chaud.

## Base de données

- Schéma : `migrations/0001_init.sql`
- Données de test : `seed/seed.sql`

```bash
npm run db:migrate:local    # migrations en local
npm run db:seed:local       # données de test en local
npm run db:migrate:remote   # migrations sur la base Cloudflare (production)
```

## Déploiement (Cloudflare)

1. `npx wrangler login`
2. Créer les ressources et reporter les IDs dans `wrangler.toml` :
   ```bash
   npx wrangler d1 create chatel-locations        # -> database_id
   npx wrangler kv namespace create SESSION        # -> id
   npx wrangler r2 bucket create chatel-photos
   ```
3. Schéma en production : `npm run db:migrate:remote`
4. Déployer : `npm run deploy` (= `astro build` + `wrangler deploy`)
5. Brancher le domaine `chatel-appartement.com` (dashboard Cloudflare → Worker → Custom Domains).

> Aucune clé secrète dans le code. Les secrets (ex. Stripe) se posent via
> `npx wrangler secret put NOM_DU_SECRET`.

## État d'avancement

- [x] Schéma D1 + données de test (3 appartements)
- [x] Front public SEO (accueil, liste/recherche, fiche, calendrier, contact, sitemap, robots)
- [ ] Authentification + back-office propriétaire (CRUD cloisonné)
- [ ] Synchronisation iCal (import/export OTA, anti-double-booking)
- [ ] Moteur de réservation + paiement Stripe (acompte) + emails
- [ ] Conformité (taxe de séjour, CGV, RGPD) + back-office admin
