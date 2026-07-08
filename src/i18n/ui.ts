// Dictionnaire des textes d'interface. Architecture prete pour le multilingue :
// FR par defaut, EN en phase 2. Aucun texte d'interface n'est code en dur dans les pages.

export const languages = {
  fr: 'Francais',
  en: 'English',
} as const;

export const defaultLang = 'fr';
export type Lang = keyof typeof languages;

export const ui = {
  fr: {
    'site.nom': 'Pensée des Alpes',
    'site.baseline': 'Locations de vacances à Châtel · Portes du Soleil',
    'nav.accueil': 'Accueil',
    'nav.logements': 'Nos logements',
    'nav.station': 'Châtel & les Portes du Soleil',
    'nav.contact': 'Contact',
    'nav.reserver': 'Réserver',

    'home.hero.titre': 'Vos vacances à Châtel, en réservation directe',
    'home.hero.sous_titre': 'Le chalet Pensée des Alpes — à 500 m du télésiège, vue sur les montagnes. Location en direct auprès des propriétaires, sans commission.',
    'home.recherche.titre': 'Vérifier les disponibilités',
    'home.avantages.titre': 'Pourquoi réserver en direct ?',
    'home.avantages.1.titre': 'Sans commission',
    'home.avantages.1.texte': 'Réservation directe auprès des propriétaires : pas de frais de plateforme.',
    'home.avantages.2.titre': 'Au pied des pistes',
    'home.avantages.2.texte': 'À 500 m du télésiège de la Barbossine, accès au domaine des Portes du Soleil.',
    'home.avantages.3.titre': 'Un accueil familial',
    'home.avantages.3.texte': 'Des propriétaires disponibles qui connaissent la station et vous conseillent.',
    'home.logements.titre': 'Nos logements',
    'home.logements.voir_tout': 'Voir tous les logements',

    'home.saisons.titre': 'Été comme hiver, au cœur des Portes du Soleil',
    'home.saisons.sous_titre': 'Un même chalet, deux saisons à vivre au pied des montagnes.',
    'home.saisons.hiver.tag': 'Hiver · Ski',
    'home.saisons.hiver.titre': 'Ski au pied des pistes',
    'home.saisons.hiver.texte': 'À 50–500 m des télésièges, accès direct aux 600 km des Portes du Soleil (12 stations franco-suisses). Casier à skis, navette gratuite.',
    'home.saisons.ete.tag': 'Été · Nature',
    'home.saisons.ete.titre': 'Randonnée, VTT & alpages',
    'home.saisons.ete.texte': 'Sentiers au départ du chalet, Bike Park des Portes du Soleil, lac et grands espaces verts. Le calme de la montagne en famille.',
    'home.saisons.cta': 'Découvrir Châtel',

    'search.arrivee': 'Arrivée',
    'search.depart': 'Départ',
    'search.personnes': 'Voyageurs',
    'search.personne': 'voyageur',
    'search.personnes_pluriel': 'voyageurs',
    'search.rechercher': 'Rechercher',
    'search.resultats': 'logement(s) disponible(s)',
    'search.aucun': 'Aucun logement disponible pour ces critères. Essayez d’autres dates.',

    'liste.titre': 'Nos logements à Châtel',
    'liste.filtre.tous': 'Tous',
    'liste.a_partir_de': 'à partir de',
    'liste.par_semaine': '/ semaine',
    'liste.par_nuit': '/ nuit',
    'liste.personnes': 'pers.',
    'liste.chambres': 'ch.',
    'liste.sdb': 'sdb',
    'liste.voir': 'Voir le logement',

    'fiche.equipements': 'Équipements',
    'fiche.description': 'Description',
    'fiche.localisation': 'Localisation',
    'fiche.calendrier': 'Disponibilités',
    'fiche.tarifs': 'Tarifs',
    'fiche.tarifs_indicatifs': 'Tarifs indicatifs — à confirmer',
    'fiche.periode': 'Période',
    'fiche.semaine': 'Semaine',
    'fiche.nuit': 'Nuit',
    'fiche.nuits_min': 'Nuits min.',
    'fiche.reserver': 'Demander une réservation',
    'fiche.numero_meuble': 'N° d’enregistrement meublé de tourisme',
    'fiche.capacite': 'Capacité',
    'fiche.surface': 'Surface',
    'fiche.altitude': 'Altitude',
    'fiche.retour': 'Retour aux logements',
    'fiche.brouillon': 'Fiche en cours de préparation',

    'cal.libre': 'Libre',
    'cal.reserve': 'Réservé',
    'cal.bloque': 'Indisponible',
    'cal.jours': ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    'cal.mois': ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],

    'contact.titre': 'Demande de réservation',
    'contact.intro': 'Remplissez ce formulaire, nous revenons vers vous rapidement pour confirmer.',
    'contact.nom': 'Nom et prénom',
    'contact.email': 'E-mail',
    'contact.telephone': 'Téléphone',
    'contact.logement': 'Logement souhaité',
    'contact.message': 'Votre message',
    'contact.envoyer': 'Envoyer la demande',
    'contact.note_acompte': 'Un acompte de 30 % est demandé à la réservation, le solde à l’arrivée.',

    'footer.proprietaire': 'Propriétaires',
    'footer.mentions': 'Mentions légales',
    'footer.cgv': 'Conditions générales',
    'footer.confidentialite': 'Confidentialité',
    'footer.direct': 'Réservation directe, sans commission.',

    'equip.wifi': 'WiFi',
    'equip.parking_garage': 'Parking au garage',
    'equip.parking': 'Parking privé',
    'equip.lave_vaisselle': 'Lave-vaisselle',
    'equip.lave_linge_partage': 'Lave-linge (partagé)',
    'equip.cheminee_poele': 'Cheminée / poêle à bois',
    'equip.television': 'Télévision',
    'equip.casier_skis': 'Casier à skis',
    'equip.balcon': 'Balcon',
    'equip.vue_montagne': 'Vue montagne',
    'equip.animaux_acceptes': 'Animaux acceptés',
    'equip.borne_recharge': 'Borne de recharge électrique',
  },
} as const;

// Recupere le traducteur pour une langue donnee (fallback FR).
export function useTranslations(lang: Lang = defaultLang) {
  return function t(key: keyof (typeof ui)['fr']) {
    return (ui[lang] as (typeof ui)['fr'])[key] ?? ui[defaultLang][key];
  };
}
