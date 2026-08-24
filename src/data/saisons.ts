// =====================================================================
// Contenu éditorial saisonnier de la vitrine.
//
// ⚠️  À RELIRE PAR LES PROPRIÉTAIRES avant mise en ligne :
//   - les avis (`avis`) sont des EMPLACEMENTS À REMPLIR, pas de vrais
//     témoignages : recopiez-y des commentaires réellement reçus, ou
//     videz le tableau (la section disparaît alors du site) ;
//   - les chiffres marqués « (à vérifier) » viennent de la maquette et
//     ne sont pas recoupés avec les fiches logements — voir la note
//     au-dessus de `chiffres` pour l'hiver.
//
// Tout le reste du site (tarifs, disponibilités, photos) vient de la
// base de données : rien de tout cela n'est écrit en dur ici.
// =====================================================================
import type { Saison } from '../lib/saison';

export interface Chiffre { valeur: string; libelle: string; icone: string; }
export interface Activite { titre: string; texte: string; icone: string; }
export interface Avis { texte: string; auteur: string; periode: string; note: number; }

export interface ContenuSaison {
  libelle: string;
  icone: string;
  kicker: string;
  titre: string;
  accroche: string;
  /** Photo de secours si aucun média « accueil_hero_<saison> » n'est chargé. */
  imageDefaut: string;
  imageAlt: string;
  chiffres: Chiffre[];
  /** Bandeau d'offre : location de ski l'hiver, Multi Pass l'été. */
  mention: { titre: string; texte: string; icone: string };
  activites: Activite[];
  avis: Avis[];
  galerieTitre: string;
  calendrierTexte: string;
}

export const contenuSaisons: Record<Saison, ContenuSaison> = {
  hiver: {
    libelle: 'Hiver',
    icone: 'flocon',
    kicker: 'Saison de ski · Portes du Soleil',
    titre: 'L’hiver à Châtel, les skis aux pieds',
    accroche:
      'Des appartements de famille à quelques minutes des remontées, casier à skis privatif et poêle à bois pour le retour des pistes. Accès direct au domaine des Portes du Soleil.',
    imageDefaut: '/images/saison-hiver.svg',
    imageAlt: 'Les pistes de Châtel sous la neige, domaine des Portes du Soleil',
    // NB : « 180 m » est la valeur reprise de la maquette. Les fiches logements
    // annoncent 50 m (L’Étrye) et 500 m (Pensée des Alpes) du télésiège :
    // à trancher par les propriétaires avant publication.
    chiffres: [
      { valeur: '180 m', libelle: 'des remontées mécaniques (à vérifier)', icone: 'ski' },
      { valeur: '600 km', libelle: 'de pistes reliées', icone: 'mountain' },
      { valeur: '12', libelle: 'stations franco-suisses', icone: 'map' },
    ],
    mention: {
      titre: 'Tarif préférentiel sur la location de ski',
      texte:
        'Nos locataires bénéficient d’une remise chez notre loueur partenaire de Châtel : skis, chaussures et casques réservés avant l’arrivée, retirés à deux pas du chalet.',
      icone: 'ski',
    },
    activites: [
      { titre: 'Ski alpin', texte: 'Les Portes du Soleil : 600 km de pistes entre France et Suisse, du débutant au hors-piste.', icone: 'ski' },
      { titre: 'Ski de fond & raquettes', texte: 'Les boucles nordiques de la vallée d’Abondance et les sentiers raquettes au départ du village.', icone: 'flocon' },
      { titre: 'Luge & après-ski', texte: 'Piste de luge, patinoire et marché du village : de quoi occuper les fins de journée en famille.', icone: 'luge' },
      { titre: 'Navette gratuite', texte: 'L’arrêt de la navette de station est au pied du chalet : on se gare une fois pour la semaine.', icone: 'car' },
    ],
    avis: [
      { texte: 'AVIS À REMPLACER — recopiez ici un commentaire reçu pour un séjour d’hiver.', auteur: 'Prénom N.', periode: 'Février', note: 5 },
      { texte: 'AVIS À REMPLACER — recopiez ici un commentaire reçu pour un séjour d’hiver.', auteur: 'Prénom N.', periode: 'Janvier', note: 5 },
      { texte: 'AVIS À REMPLACER — recopiez ici un commentaire reçu pour un séjour d’hiver.', auteur: 'Prénom N.', periode: 'Mars', note: 4 },
    ],
    galerieTitre: 'Châtel sous la neige',
    calendrierTexte: 'Les vacances de février partent en premier : le calendrier s’ouvre sur le cœur de saison.',
  },

  ete: {
    libelle: 'Été',
    icone: 'soleil',
    kicker: 'Saison verte · Portes du Soleil',
    titre: 'L’été à Châtel, la montagne grand ouvert',
    accroche:
      'Sentiers au départ du chalet, Bike Park des Portes du Soleil et grands balcons face aux alpages. Le calme de la montagne, à prix d’été.',
    imageDefaut: '/images/saison-ete.svg',
    imageAlt: 'Les alpages de Châtel en été, vallée d’Abondance',
    chiffres: [
      { valeur: '24', libelle: 'remontées ouvertes l’été', icone: 'mountain' },
      { valeur: '1 250 m', libelle: 'd’altitude, au frais', icone: 'altitude' },
      { valeur: '12', libelle: 'stations franco-suisses', icone: 'map' },
    ],
    mention: {
      titre: 'Hébergeur partenaire Multi Pass',
      texte:
        'En séjournant chez nous, vous accédez au Multi Pass Portes du Soleil : remontées mécaniques ouvertes l’été, piscines et activités de la station comprises dans le pass.',
      icone: 'bouclier',
    },
    activites: [
      { titre: 'Randonnée', texte: 'Sentiers balisés au départ du chalet, lacs d’altitude et alpages de la vallée d’Abondance.', icone: 'sentier' },
      { titre: 'VTT & Bike Park', texte: 'Le Bike Park des Portes du Soleil, ses pistes de descente et ses itinéraires électriques.', icone: 'velo' },
      { titre: 'Lac de Vonnes', texte: 'Baignade, pêche et aire de jeux à quelques minutes du chalet.', icone: 'vague' },
      { titre: 'Vie du village', texte: 'Marché, terrasses et fêtes d’alpage : Châtel reste un vrai village l’été.', icone: 'coeur' },
    ],
    avis: [
      { texte: 'AVIS À REMPLACER — recopiez ici un commentaire reçu pour un séjour d’été.', auteur: 'Prénom N.', periode: 'Juillet', note: 5 },
      { texte: 'AVIS À REMPLACER — recopiez ici un commentaire reçu pour un séjour d’été.', auteur: 'Prénom N.', periode: 'Août', note: 5 },
      { texte: 'AVIS À REMPLACER — recopiez ici un commentaire reçu pour un séjour d’été.', auteur: 'Prénom N.', periode: 'Juin', note: 4 },
    ],
    galerieTitre: 'Châtel en vert',
    calendrierTexte: 'Juillet et août se réservent tôt : le calendrier s’ouvre sur le plein été.',
  },
};

// Atout mis en avant pour un logement, choisi selon la saison et ses
// équipements réels : on ne cite que ce que la fiche déclare vraiment.
const atoutsParEquipement: Record<Saison, [string, string][]> = {
  hiver: [
    ['casier_skis', 'Casier à skis privatif'],
    ['cheminee_poele', 'Poêle à bois pour le retour des pistes'],
    ['parking_garage', 'Parking au garage, au chaud'],
    ['parking', 'Parking privé au pied du chalet'],
    ['vue_montagne', 'Vue sur les sommets enneigés'],
  ],
  ete: [
    ['balcon', 'Balcon et mobilier de jardin'],
    ['vue_montagne', 'Vue dégagée sur les alpages'],
    ['parking_garage', 'Garage pour ranger les vélos'],
    ['parking', 'Parking privé au pied du chalet'],
    ['animaux_acceptes', 'Animaux acceptés'],
  ],
};

const atoutParDefaut: Record<Saison, string> = {
  hiver: 'À quelques minutes des remontées',
  ete: 'Départ des sentiers au pied du chalet',
};

// `graine` (l'id du logement) fait tourner l'atout retenu parmi ceux qui
// s'appliquent : les cartes ne repetent pas toutes la meme phrase, tout en
// n'annoncant que des equipements reellement declares sur la fiche.
export function atoutSaison(saison: Saison, equipements: string[], graine = 0): string {
  const possibles = atoutsParEquipement[saison]
    .filter(([code]) => equipements.includes(code))
    .map(([, phrase]) => phrase);
  if (possibles.length === 0) return atoutParDefaut[saison];
  return possibles[graine % possibles.length];
}
