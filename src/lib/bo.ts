// Accès aux données du back-office, avec cloisonnement par propriétaire.
// Règle de sécurité (cahier des charges §2) : un propriétaire ne voit/modifie
// QUE ses propres lots. Le contrôle se fait au niveau des requêtes SQL,
// pas seulement de l'interface.
import type { D1Database } from '@cloudflare/workers-types';
import type { Logement, Tarif, Disponibilite } from './types';
import type { Utilisateur } from './auth';

// Liste des lots visibles par l'utilisateur : tous si admin, sinon les siens.
export async function logementsDeLUtilisateur(DB: D1Database, user: Utilisateur): Promise<Logement[]> {
  const sql = `SELECT * FROM logements ${user.role === 'admin' ? '' : 'WHERE proprietaire_id = ?'} ORDER BY nom ASC`;
  const stmt = user.role === 'admin' ? DB.prepare(sql) : DB.prepare(sql).bind(user.id);
  const { results } = await stmt.all<Logement>();
  return results ?? [];
}

// Récupère un lot SI l'utilisateur a le droit d'y accéder (admin ou propriétaire).
// Renvoie null si introuvable OU non autorisé (pas de fuite d'information).
export async function logementAutorise(DB: D1Database, id: number, user: Utilisateur): Promise<Logement | null> {
  const l = await DB.prepare(`SELECT * FROM logements WHERE id = ?`).bind(id).first<Logement>();
  if (!l) return null;
  if (user.role !== 'admin' && l.proprietaire_id !== user.id) return null;
  return l;
}

export interface MajLogement {
  nom: string;
  type: 'appartement' | 'chalet';
  capacite_max: number;
  nb_chambres: number;
  nb_sdb: number;
  surface_m2: number | null;
  description_courte: string;
  description_longue: string;
  adresse: string;
  numero_enregistrement_meuble: string;
  equipements: string[];
  statut: 'brouillon' | 'publie' | 'masque';
}

export async function mettreAJourLogement(DB: D1Database, id: number, d: MajLogement): Promise<void> {
  await DB.prepare(
    `UPDATE logements SET
       nom = ?, type = ?, capacite_max = ?, nb_chambres = ?, nb_sdb = ?, surface_m2 = ?,
       description_courte = ?, description_longue = ?, adresse = ?,
       numero_enregistrement_meuble = ?, equipements = ?, statut = ?, date_maj = datetime('now')
     WHERE id = ?`
  ).bind(
    d.nom, d.type, d.capacite_max, d.nb_chambres, d.nb_sdb, d.surface_m2,
    d.description_courte, d.description_longue, d.adresse,
    d.numero_enregistrement_meuble, JSON.stringify(d.equipements), d.statut, id
  ).run();
}

// Charte qualité (cahier §6.7) : champs requis avant publication.
export function manquesPourPublier(l: Logement, nbPhotos: number, nbTarifs: number): string[] {
  const manques: string[] = [];
  if (!l.description_longue || l.description_longue.trim().length < 40) manques.push('une description détaillée');
  if (!l.numero_enregistrement_meuble) manques.push('le n° d’enregistrement meublé');
  if (nbTarifs < 1) manques.push('au moins une période tarifaire');
  if (nbPhotos < 1) manques.push('au moins une photo');
  return manques;
}

// ---- Tarifs ----
export async function ajouterTarif(
  DB: D1Database, logementId: number,
  t: { nom_periode: string; date_debut: string; date_fin: string; prix_nuit: number | null; prix_semaine: number | null; nuits_minimum: number }
): Promise<void> {
  await DB.prepare(
    `INSERT INTO tarifs (logement_id, nom_periode, date_debut, date_fin, prix_nuit, prix_semaine, nuits_minimum)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(logementId, t.nom_periode, t.date_debut, t.date_fin, t.prix_nuit, t.prix_semaine, t.nuits_minimum).run();
}

export async function supprimerTarif(DB: D1Database, logementId: number, tarifId: number): Promise<void> {
  // Le logement_id en condition empêche de supprimer le tarif d'un autre lot.
  await DB.prepare(`DELETE FROM tarifs WHERE id = ? AND logement_id = ?`).bind(tarifId, logementId).run();
}

// ---- Calendrier : blocages manuels ----
export async function bloquerDates(
  DB: D1Database, logementId: number, dateDebut: string, dateFin: string
): Promise<void> {
  await DB.prepare(
    `INSERT INTO disponibilites (logement_id, date_debut, date_fin, statut, source)
     VALUES (?, ?, ?, 'bloque', 'manuel')`
  ).bind(logementId, dateDebut, dateFin).run();
}

export async function supprimerDisponibilite(DB: D1Database, logementId: number, dispoId: number): Promise<void> {
  await DB.prepare(`DELETE FROM disponibilites WHERE id = ? AND logement_id = ?`).bind(dispoId, logementId).run();
}

export async function toutesOccupations(DB: D1Database, logementId: number): Promise<Disponibilite[]> {
  const { results } = await DB.prepare(
    `SELECT * FROM disponibilites WHERE logement_id = ? ORDER BY date_debut ASC`
  ).bind(logementId).all<Disponibilite>();
  return results ?? [];
}

export async function compterTarifs(DB: D1Database, logementId: number): Promise<number> {
  const r = await DB.prepare(`SELECT COUNT(*) AS c FROM tarifs WHERE logement_id = ?`).bind(logementId).first<{ c: number }>();
  return r?.c ?? 0;
}
export async function compterPhotos(DB: D1Database, logementId: number): Promise<number> {
  const r = await DB.prepare(`SELECT COUNT(*) AS c FROM photos WHERE logement_id = ?`).bind(logementId).first<{ c: number }>();
  return r?.c ?? 0;
}
