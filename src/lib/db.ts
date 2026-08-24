// Couche d'acces aux donnees (Cloudflare D1).
// Toutes les requetes publiques se limitent aux logements 'publie'.
import type { D1Database } from '@cloudflare/workers-types';
import type { Logement, LogementVignette, Photo, Tarif, Disponibilite, MediaSite } from './types';

// Paramètre général du site (ex : 'superhote_webkey'). null si absent.
export async function getParametre(DB: D1Database, cle: string): Promise<string | null> {
  const row = await DB.prepare(`SELECT valeur FROM parametres WHERE cle = ?`).bind(cle).first<{ valeur: string }>();
  return row?.valeur ?? null;
}

// Médias éditoriaux d'un emplacement (ex : 'accueil_hero', 'accueil_galerie').
export async function getMediasSite(DB: D1Database, emplacement: string): Promise<MediaSite[]> {
  const { results } = await DB.prepare(
    `SELECT * FROM medias_site WHERE emplacement = ? ORDER BY ordre ASC`
  ).bind(emplacement).all<MediaSite>();
  return results ?? [];
}

// Liste des logements publies, avec photo de couverture et prix d'appel (vignettes).
export async function getLogementsPublies(DB: D1Database): Promise<LogementVignette[]> {
  const { results } = await DB.prepare(
    `SELECT l.*,
            (SELECT p.url_r2 FROM photos p WHERE p.logement_id = l.id
              ORDER BY p.est_couverture DESC, p.ordre ASC LIMIT 1) AS couverture,
            (SELECT p.texte_alt FROM photos p WHERE p.logement_id = l.id
              ORDER BY p.est_couverture DESC, p.ordre ASC LIMIT 1) AS couverture_alt,
            (SELECT MIN(t.prix_semaine) FROM tarifs t WHERE t.logement_id = l.id) AS prix_min_semaine
       FROM logements l
      WHERE l.statut = 'publie'
      ORDER BY l.capacite_max DESC, l.nom ASC`
  ).all<LogementVignette>();
  return results ?? [];
}

// Toutes les vignettes (publie OU brouillon) — utile pour la page liste qui montre
// aussi les fiches "a completer". Le drapeau statut permet de les distinguer a l'affichage.
export async function getToutesVignettes(DB: D1Database): Promise<LogementVignette[]> {
  const { results } = await DB.prepare(
    `SELECT l.*,
            (SELECT p.url_r2 FROM photos p WHERE p.logement_id = l.id
              ORDER BY p.est_couverture DESC, p.ordre ASC LIMIT 1) AS couverture,
            (SELECT p.texte_alt FROM photos p WHERE p.logement_id = l.id
              ORDER BY p.est_couverture DESC, p.ordre ASC LIMIT 1) AS couverture_alt,
            (SELECT MIN(t.prix_semaine) FROM tarifs t WHERE t.logement_id = l.id) AS prix_min_semaine
       FROM logements l
      WHERE l.statut IN ('publie', 'brouillon')
      ORDER BY (l.statut = 'publie') DESC, l.capacite_max DESC, l.nom ASC`
  ).all<LogementVignette>();
  return results ?? [];
}

export async function getLogementBySlug(DB: D1Database, slug: string): Promise<Logement | null> {
  const row = await DB.prepare(
    `SELECT * FROM logements WHERE slug = ? LIMIT 1`
  ).bind(slug).first<Logement>();
  return row ?? null;
}

export async function getPhotos(DB: D1Database, logementId: number): Promise<Photo[]> {
  const { results } = await DB.prepare(
    `SELECT * FROM photos WHERE logement_id = ? ORDER BY est_couverture DESC, ordre ASC`
  ).bind(logementId).all<Photo>();
  return results ?? [];
}

export async function getTarifs(DB: D1Database, logementId: number): Promise<Tarif[]> {
  const { results } = await DB.prepare(
    `SELECT * FROM tarifs WHERE logement_id = ? ORDER BY date_debut ASC`
  ).bind(logementId).all<Tarif>();
  return results ?? [];
}

// Disponibilites occupees (reserve/bloque) a partir d'aujourd'hui.
export async function getOccupations(DB: D1Database, logementId: number): Promise<Disponibilite[]> {
  const { results } = await DB.prepare(
    `SELECT * FROM disponibilites
      WHERE logement_id = ? AND statut IN ('reserve', 'bloque') AND date_fin >= date('now')
      ORDER BY date_debut ASC`
  ).bind(logementId).all<Disponibilite>();
  return results ?? [];
}

// Recherche : logements publies dont la capacite suffit et qui n'ont AUCUN
// chevauchement reserve/bloque sur [arrivee, depart[. Coeur de l'anti double-booking cote public.
export async function rechercherDisponibles(
  DB: D1Database,
  arrivee: string,
  depart: string,
  personnes: number
): Promise<LogementVignette[]> {
  const { results } = await DB.prepare(
    `SELECT l.*,
            (SELECT p.url_r2 FROM photos p WHERE p.logement_id = l.id
              ORDER BY p.est_couverture DESC, p.ordre ASC LIMIT 1) AS couverture,
            (SELECT p.texte_alt FROM photos p WHERE p.logement_id = l.id
              ORDER BY p.est_couverture DESC, p.ordre ASC LIMIT 1) AS couverture_alt,
            (SELECT MIN(t.prix_semaine) FROM tarifs t WHERE t.logement_id = l.id) AS prix_min_semaine
       FROM logements l
      WHERE l.statut = 'publie'
        AND l.capacite_max >= ?
        AND NOT EXISTS (
          SELECT 1 FROM disponibilites d
           WHERE d.logement_id = l.id
             AND d.statut IN ('reserve', 'bloque')
             AND d.date_debut < ?      -- depart
             AND d.date_fin   > ?      -- arrivee
        )
      ORDER BY l.capacite_max ASC, l.nom ASC`
  ).bind(personnes, depart, arrivee).all<LogementVignette>();
  return results ?? [];
}

// Prix par nuit le plus bas de chaque logement sur une fenetre de dates
// (une saison). Renvoie une Map logement_id -> prix ; un logement absent de
// la Map n'a simplement aucun tarif saisi pour cette periode : on n'affiche
// alors aucun prix plutot qu'une valeur devinee.
export async function getPrixNuitParSaison(
  DB: D1Database,
  debut: string,
  fin: string
): Promise<Map<number, number>> {
  const { results } = await DB.prepare(
    `SELECT logement_id, MIN(prix_nuit) AS prix
       FROM tarifs
      WHERE prix_nuit IS NOT NULL
        AND date_debut < ?   -- fin de la fenetre
        AND date_fin   > ?   -- debut de la fenetre
      GROUP BY logement_id`
  ).bind(fin, debut).all<{ logement_id: number; prix: number }>();
  return new Map((results ?? []).map((r) => [r.logement_id, r.prix]));
}

// Toutes les occupations (reserve/bloque) des logements publies, a partir
// d'aujourd'hui. Sert au calendrier d'ensemble de la page d'accueil.
export async function getOccupationsPubliees(DB: D1Database): Promise<Disponibilite[]> {
  const { results } = await DB.prepare(
    `SELECT d.* FROM disponibilites d
       JOIN logements l ON l.id = d.logement_id
      WHERE l.statut = 'publie'
        AND d.statut IN ('reserve', 'bloque')
        AND d.date_fin >= date('now')
      ORDER BY d.date_debut ASC`
  ).all<Disponibilite>();
  return results ?? [];
}
