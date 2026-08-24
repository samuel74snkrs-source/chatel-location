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
    'site.nom': 'Châtel Appartements',
    'site.lieu': 'Châtel · Portes du Soleil',
    'site.baseline': 'Locations de vacances à Châtel · Portes du Soleil',
    'site.aller_contenu': 'Aller au contenu',
    'nav.accueil': 'Accueil',
    'nav.logements': 'Nos logements',
    'nav.station': 'Châtel & les Portes du Soleil',
    'nav.contact': 'Contact',
    'nav.reserver': 'Réserver',

    'home.hero.titre': 'Vos vacances à Châtel, au pied des Portes du Soleil',
    'home.hero.sous_titre': 'Chalets et appartements de charme à Châtel, de 50 à 500 m des pistes. Vue montagne, confort et accueil familial.',
    'home.recherche.titre': 'Vérifier les disponibilités',
    'home.recherche.aide': 'Indiquez vos dates : seuls les logements réellement disponibles s’affichent.',

    // Bandeau de réassurance sous le hero.
    'home.reassurance.1.titre': 'Jusqu’à 10 personnes',
    'home.reassurance.1.texte': 'Des appartements pensés pour les familles et les tribus.',
    'home.reassurance.2.titre': '50 à 500 m des pistes',
    'home.reassurance.2.texte': 'Accès direct aux 600 km des Portes du Soleil.',
    'home.reassurance.3.titre': 'Parking & casier à skis',
    'home.reassurance.3.texte': 'On se gare une fois, on pose les skis, et c’est parti.',
    'home.reassurance.4.titre': 'Des propriétaires présents',
    'home.reassurance.4.texte': 'Une famille de Châtel qui répond et qui conseille.',

    // Section « en famille ».
    'home.famille.surtitre': 'Une maison de famille',
    'home.famille.titre': 'Le chalet familial, ouvert aux vôtres',
    'home.famille.texte': 'Nos appartements sont ceux d’une famille installée à Châtel depuis longtemps. On y retrouve les grandes tablées, les balcons face aux montagnes et le poêle qu’on allume en rentrant des pistes.',
    'home.famille.1': 'Grands séjours et cuisines équipées pour cuisiner à plusieurs',
    'home.famille.2': 'Lits enfants, lits superposés et espace pour jouer',
    'home.famille.3': 'Balcon, vue montagne et soleil du matin au soir',
    'home.famille.4': 'Remise des clés en main propre, conseils sur la station',
    'home.famille.cta': 'Découvrir les logements',

    'home.avantages.surtitre': 'Nos engagements',
    'home.avantages.titre': 'Pourquoi Châtel Appartements ?',
    'home.avantages.1.titre': 'Sans commission',
    'home.avantages.1.texte': 'Vous réservez directement auprès des propriétaires, sans frais de plateforme.',
    'home.avantages.2.titre': 'Au pied des pistes',
    'home.avantages.2.texte': 'À 500 m du télésiège de la Barbossine, accès au domaine des Portes du Soleil.',
    'home.avantages.3.titre': 'Un accueil familial',
    'home.avantages.3.texte': 'Des propriétaires disponibles qui connaissent la station et vous conseillent.',
    'home.logements.surtitre': 'À louer',
    'home.logements.titre': 'Nos logements',
    'home.logements.voir_tout': 'Voir tous les logements',
    'home.galerie.titre': 'Châtel en images',

    // Bascule saisonnière de la page d'accueil.
    'home.saison.aide': 'Basculez entre l’hiver et l’été : toute la page s’adapte.',
    'home.chiffres.titre': 'La station en bref',
    'home.activites.surtitre': 'Sur place',
    'home.activites.titre': 'Que faire pendant votre séjour ?',
    'home.avis.surtitre': 'Ils sont venus',
    'home.avis.titre': 'Ce que disent nos locataires',
    'home.calendrier.surtitre': 'Disponibilités',
    'home.calendrier.titre': 'Choisissez vos dates',
    'home.calendrier.cta': 'Voir les disponibilités logement par logement',
    'home.hero.cta_secondaire': 'Découvrir la station',

    'home.saisons.surtitre': 'Deux saisons',
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
    'liste.tarif_sur_demande': 'Tarif sur demande',
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
    'footer.presentation': 'Appartements de famille à Châtel, en Haute-Savoie, au cœur du domaine des Portes du Soleil. Été comme hiver.',
    'footer.decouvrir': 'Découvrir',
    'footer.infos': 'Informations',
    'footer.contact': 'Nous contacter',
    'footer.espace': 'Espace propriétaire',

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
