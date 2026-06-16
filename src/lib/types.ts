// Types correspondant au schema D1 (voir migrations/0001_init.sql).

export interface Logement {
  id: number;
  proprietaire_id: number;
  type: 'appartement' | 'chalet';
  nom: string;
  slug: string;
  capacite_max: number;
  nb_chambres: number;
  nb_sdb: number;
  surface_m2: number | null;
  description_courte: string | null;
  description_longue: string | null;
  adresse: string | null;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  equipements: string | null; // JSON
  numero_enregistrement_meuble: string | null;
  statut: 'brouillon' | 'publie' | 'masque';
  date_creation: string;
  date_maj: string;
}

export interface Photo {
  id: number;
  logement_id: number;
  url_r2: string;
  ordre: number;
  texte_alt: string | null;
  est_couverture: number;
}

export interface Tarif {
  id: number;
  logement_id: number;
  nom_periode: string;
  date_debut: string;
  date_fin: string;
  prix_nuit: number | null;
  prix_semaine: number | null;
  nuits_minimum: number;
}

export interface Disponibilite {
  id: number;
  logement_id: number;
  date_debut: string;
  date_fin: string;
  statut: 'libre' | 'reserve' | 'bloque';
  source: 'direct' | 'airbnb' | 'booking' | 'manuel';
  reference_externe: string | null;
  date_creation: string;
}

// Logement enrichi pour l'affichage (photo de couverture + prix d'appel).
export interface LogementVignette extends Logement {
  couverture: string | null;
  couverture_alt: string | null;
  prix_min_semaine: number | null;
}
