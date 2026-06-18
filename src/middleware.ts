import { defineMiddleware } from 'astro:middleware';
import { utilisateurDepuisRequete } from './lib/auth';

// Charge l'utilisateur connecté (s'il y en a un) dans Astro.locals.user,
// et protège l'espace privé : toute route /espace (hors page de connexion)
// nécessite une session valide.
export const onRequest = defineMiddleware(async (context, next) => {
  const env = context.locals.runtime?.env;
  if (env?.DB && env?.SESSION) {
    context.locals.user = (await utilisateurDepuisRequete(context.request, env.SESSION, env.DB)) ?? undefined;
  }

  const chemin = context.url.pathname;
  const estEspace = chemin === '/espace' || chemin.startsWith('/espace/');
  const estConnexion = chemin.startsWith('/espace/connexion');

  if (estEspace && !estConnexion && !context.locals.user) {
    const retour = encodeURIComponent(chemin + context.url.search);
    return context.redirect(`/espace/connexion?retour=${retour}`, 302);
  }

  return next();
});
