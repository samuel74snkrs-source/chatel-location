-- =====================================================================
-- Donnees de test — Chalet "Pensée des Alpes", Châtel (74390)
-- Sources : annonce Gîtes de France 74G63040 + site chatel-appartement.com
-- NB : seul l'appartement 2 dispose de donnees verifiees. Les apparts 1 et 3
--      portent des valeurs INDICATIVES a confirmer (cf. regle "ne pas inventer").
-- =====================================================================

-- Repartir d'une base propre (ordre inverse des FK)
DELETE FROM flux_ical;
DELETE FROM paiements;
DELETE FROM reservations;
DELETE FROM disponibilites;
DELETE FROM tarifs;
DELETE FROM photos;
DELETE FROM logements;
DELETE FROM proprietaires;
DELETE FROM sqlite_sequence;

-- ---------------------------------------------------------------------
-- Proprietaires
-- mot_de_passe_hash NULL pour l'instant (auth ajoutee en phase back-office).
-- ---------------------------------------------------------------------
INSERT INTO proprietaires (id, nom, prenom, email, telephone, role, statut) VALUES
  (1, 'Grillet-Aubert', 'Stéphane et Dominique', 'contact@chatel-appartement.com', '+33 6 82 93 46 01', 'proprietaire', 'actif'),
  (2, 'Grillet-Aubert', 'Samuel', 'samuel74.ga@gmail.com', NULL, 'admin', 'actif');

-- ---------------------------------------------------------------------
-- Logements (3 appartements du meme chalet)
-- Adresse chalet : 1735 chemin du Petit-Châtel, 74390 Châtel — altitude ~1250 m.
-- ---------------------------------------------------------------------

-- Appartement 2 : DONNEES VERIFIEES (Gîtes de France 74G63040)
INSERT INTO logements (
  id, proprietaire_id, type, nom, slug, capacite_max, nb_chambres, nb_sdb, surface_m2,
  description_courte, description_longue, adresse, latitude, longitude, altitude,
  equipements, numero_enregistrement_meuble, statut
) VALUES (
  2, 1, 'appartement', 'Pensée des Alpes — Appartement 2', 'pensee-des-alpes-appartement-2',
  10, 3, 2, 100,
  'Spacieux appartement de 100 m² (8 à 10 personnes) au 2e étage du chalet, magnifique vue sur les montagnes et le village, à 500 m du télésiège.',
  'Appartement spacieux de 100 m² au 2e étage du chalet Pensée des Alpes, avec une magnifique vue sur les montagnes et le village de Châtel. Situé à 1,5 km du centre du village et à 500 m du télésiège de la Barbossine (Petit-Châtel) donnant accès au domaine des Portes du Soleil. Balcon avec mobilier de jardin, transat et parasol. Cheminée avec poêle à bois pour les soirées d''hiver.

3 chambres : chambre 1 (1 lit 140x190), chambre 2 (1 lit 160x200), chambre 3 (2 lits 90x190 + 2 lits superposés 80x190). 2 salles d''eau avec douche et 2 WC.

Casier à skis privé, place de parking privative au garage. Lave-vaisselle, lave-linge (partagé entre les appartements), WiFi, télévision. Draps, linge de toilette et ménage de fin de séjour en option. Animaux acceptés (supplément 40 € / séjour). Borne de recharge véhicule électrique (7 € / jour).',
  '1735 chemin du Petit-Châtel, 74390 Châtel',
  46.2730, 6.8520, 1250,
  '["wifi","parking_garage","lave_vaisselle","lave_linge_partage","cheminee_poele","television","casier_skis","balcon","vue_montagne","animaux_acceptes","borne_recharge"]',
  '63040', 'publie'
);

-- Appartement 1 : INDICATIF (a completer) — env. 10 personnes
INSERT INTO logements (
  id, proprietaire_id, type, nom, slug, capacite_max, nb_chambres, nb_sdb, surface_m2,
  description_courte, description_longue, adresse, latitude, longitude, altitude,
  equipements, numero_enregistrement_meuble, statut
) VALUES (
  1, 1, 'appartement', 'Pensée des Alpes — Appartement 1', 'pensee-des-alpes-appartement-1',
  10, 3, 1, NULL,
  'Appartement du chalet Pensée des Alpes (capacité ~10 personnes). Fiche à compléter.',
  'Appartement situé dans le chalet Pensée des Alpes à Châtel, à 500 m du télésiège de la Barbossine. Description détaillée, surface et nombre de couchages à confirmer par le propriétaire.',
  '1735 chemin du Petit-Châtel, 74390 Châtel',
  46.2730, 6.8520, 1250,
  '["wifi","parking_garage","cheminee_poele","lave_linge_partage","casier_skis","vue_montagne"]',
  NULL, 'brouillon'
);

-- Appartement 3 : INDICATIF (a completer) — env. 7 personnes
INSERT INTO logements (
  id, proprietaire_id, type, nom, slug, capacite_max, nb_chambres, nb_sdb, surface_m2,
  description_courte, description_longue, adresse, latitude, longitude, altitude,
  equipements, numero_enregistrement_meuble, statut
) VALUES (
  3, 1, 'appartement', 'Pensée des Alpes — Appartement 3', 'pensee-des-alpes-appartement-3',
  7, 2, 1, NULL,
  'Appartement du chalet Pensée des Alpes (capacité ~7 personnes). Fiche à compléter.',
  'Appartement situé dans le chalet Pensée des Alpes à Châtel, à 500 m du télésiège de la Barbossine. Description détaillée, surface et nombre de couchages à confirmer par le propriétaire.',
  '1735 chemin du Petit-Châtel, 74390 Châtel',
  46.2730, 6.8520, 1250,
  '["wifi","parking_garage","cheminee_poele","lave_linge_partage","casier_skis","vue_montagne"]',
  NULL, 'brouillon'
);

-- ---------------------------------------------------------------------
-- Photos (PLACEHOLDERS — a remplacer par les vraies photos via R2)
-- ---------------------------------------------------------------------
INSERT INTO photos (logement_id, url_r2, ordre, texte_alt, est_couverture) VALUES
  (2, '/images/placeholders/appart-vue.svg',     0, 'Vue sur les montagnes depuis le balcon', 1),
  (2, '/images/placeholders/appart-salon.svg',   1, 'Salon avec cheminée', 0),
  (2, '/images/placeholders/appart-chambre.svg', 2, 'Chambre', 0),
  (2, '/images/placeholders/appart-cuisine.svg', 3, 'Cuisine équipée', 0),
  (1, '/images/placeholders/appart-vue.svg',     0, 'Vue sur les montagnes', 1),
  (1, '/images/placeholders/appart-salon.svg',   1, 'Salon', 0),
  (3, '/images/placeholders/appart-vue.svg',     0, 'Vue sur les montagnes', 1),
  (3, '/images/placeholders/appart-salon.svg',   1, 'Salon', 0);

-- ---------------------------------------------------------------------
-- Tarifs
-- Appartement 2 : ancres reelles (Gîtes de France) : ~510 €/sem (ete/basse) a
--   2373,50 €/sem (pic vacances de fevrier). Periodes intermediaires = INDICATIF.
-- Saison 2026-2027.
-- ---------------------------------------------------------------------
INSERT INTO tarifs (logement_id, nom_periode, date_debut, date_fin, prix_nuit, prix_semaine, nuits_minimum) VALUES
  (2, 'Été 2026',                 '2026-06-28', '2026-08-30',  90, 510, 7),
  (2, 'Automne / basse saison',   '2026-08-30', '2026-12-19',  85, 480, 3),
  (2, 'Vacances de Noël',         '2026-12-19', '2027-01-02', 230, 1600, 7),
  (2, 'Janvier (hors vacances)',  '2027-01-02', '2027-02-06', 140, 900, 7),
  (2, 'Vacances de février',      '2027-02-06', '2027-03-06', 340, 2373.5, 7),
  (2, 'Mars (fin de saison)',     '2027-03-06', '2027-04-12', 120, 750, 7),
  -- Apparts 1 et 3 : valeurs INDICATIVES a confirmer
  (1, 'Hiver (indicatif)',        '2026-12-19', '2027-04-12', 200, 1300, 7),
  (1, 'Été (indicatif)',          '2026-06-28', '2026-08-30',  90, 500, 7),
  (3, 'Hiver (indicatif)',        '2026-12-19', '2027-04-12', 150, 950, 7),
  (3, 'Été (indicatif)',          '2026-06-28', '2026-08-30',  75, 420, 7);

-- ---------------------------------------------------------------------
-- Disponibilites (exemples pour demontrer le calendrier + anti double-booking)
-- ---------------------------------------------------------------------
INSERT INTO disponibilites (logement_id, date_debut, date_fin, statut, source, reference_externe) VALUES
  (2, '2027-02-13', '2027-02-20', 'reserve', 'airbnb', 'airbnb-demo-uid-001'),
  (2, '2026-12-24', '2026-12-31', 'reserve', 'direct', NULL),
  (2, '2026-11-10', '2026-11-15', 'bloque',  'manuel', NULL);

-- ---------------------------------------------------------------------
-- Flux iCal (exemples — URLs factices a remplacer par les vraies exports OTA)
-- ---------------------------------------------------------------------
INSERT INTO flux_ical (logement_id, plateforme, url_import, statut_derniere_synchro) VALUES
  (2, 'airbnb', 'https://www.airbnb.fr/calendar/ical/EXEMPLE.ics?s=REMPLACER', 'jamais');
