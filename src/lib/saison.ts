// Bascule saisonnière du site : toute la vitrine (accroche, photos, chiffres,
// tarifs, activités, avis, calendrier) se décline en « hiver » ou « été ».
// La saison choisie est portée par l'attribut data-saison sur <html> :
// le rendu contient les deux versions, le CSS n'en montre qu'une.

export type Saison = 'hiver' | 'ete';
export const SAISONS: readonly Saison[] = ['hiver', 'ete'] as const;

// Date locale au format YYYY-MM-DD (pas de toISOString : décalage de fuseau).
function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Saison proposée par défaut : novembre → avril = hiver, mai → octobre = été.
// Sert au premier affichage (avant tout choix mémorisé du visiteur).
export function saisonParDefaut(ref: Date = new Date()): Saison {
  const m = ref.getMonth(); // 0 = janvier
  return m >= 10 || m <= 3 ? 'hiver' : 'ete';
}

export interface FenetreSaison {
  /** Début de la saison (YYYY-MM-DD) — sert à chercher les tarifs applicables. */
  debut: string;
  /** Fin de la saison (exclue). */
  fin: string;
  /** Mois sur lequel le calendrier est recalé : février (hiver) / juillet (été). */
  ancre: Date;
  /** Libellé du mois d'ancrage, ex. « février 2027 ». */
  annee: number;
}

// Cœur de saison, volontairement resserré sur les périodes réellement
// vendues comme telles : 20 déc → 5 avr pour l'hiver, 1er juil → 25 août
// pour l'été. Une fenêtre plus large happerait les tarifs d'entre-saison
// (fin août, mi-décembre) et afficherait un « à partir de » trompeur.
function finSaison(saison: Saison, annee: number): Date {
  return saison === 'hiver' ? new Date(annee, 3, 5) : new Date(annee, 7, 25);
}

// Prochaine occurrence de la saison. Tant que la saison en cours n'est pas
// terminée on reste dessus ; ensuite on bascule sur celle de l'année suivante.
export function fenetreSaison(saison: Saison, ref: Date = new Date()): FenetreSaison {
  const jour = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  let a = jour.getFullYear();
  if (jour > finSaison(saison, a)) a += 1;

  const debut = saison === 'hiver' ? new Date(a - 1, 11, 20) : new Date(a, 6, 1);
  const fin = finSaison(saison, a);

  // Mois d'ancrage du calendrier ; jamais dans le passé (on ne remonte pas
  // avant le mois courant, sinon le calendrier s'ouvre sur des dates révolues).
  let ancre = new Date(a, saison === 'hiver' ? 1 : 6, 1);
  const moisCourant = new Date(jour.getFullYear(), jour.getMonth(), 1);
  if (ancre < moisCourant) ancre = moisCourant;

  return { debut: iso(debut), fin: iso(fin), ancre, annee: a };
}
