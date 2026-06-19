-- =====================================================================
-- AJOUT (additif) du chalet "L'Étrye" — Châtel (hameau du Linga, 74390)
-- Mêmes propriétaires que Pensée des Alpes (proprietaire_id = 1).
-- Sources : Gîtes de France 74G63038 (appartement 5) + chatel-appartement.com.
-- IDs 4 à 8 réservés à L'Étrye. Script idempotent (re-jouable) : il purge
-- d'abord les logements 4..8 (et leurs enfants via cascade) SANS toucher
-- aux logements 1..3 (Pensée des Alpes) ni aux comptes/mots de passe.
-- Seul l'appartement 5 a des données vérifiées ; les 4 autres sont en
-- brouillon "à compléter" (le propriétaire les complétera via le back-office).
-- =====================================================================

DELETE FROM logements WHERE id BETWEEN 4 AND 8;

-- Appartement 5 : DONNÉES VÉRIFIÉES (Gîtes de France 74G63038)
INSERT INTO logements (
  id, proprietaire_id, type, nom, slug, capacite_max, nb_chambres, nb_sdb, surface_m2,
  description_courte, description_longue, adresse, latitude, longitude, altitude,
  equipements, numero_enregistrement_meuble, statut
) VALUES (
  8, 1, 'appartement', 'L''Étrye — Appartement 5', 'l-etrye-appartement-5',
  10, 4, 2, 81,
  'Appartement de 81 m² (10 pers., 4 chambres) au 3e étage, plein sud, face aux pistes du Linga — télécabine à 50 m.',
  'Appartement de 81 m² (+ environ 15 m² de combles) au 3e étage du chalet L''Étrye, exposé plein sud et situé face aux pistes du Linga, avec la télécabine à 50–100 m. Accès au domaine des Portes du Soleil.

Cuisine intégrée avec coin repas, ouverte sur le séjour : plaque de cuisson, four, micro-ondes, lave-vaisselle, réfrigérateur, cafetière, grille-pain, appareil à raclette et caquelon à fondue.

4 chambres : chambre 1 (1 lit 160x200), chambre 2 (2 lits 90x190, communicante avec la chambre 1), chambre 3 (3 lits 90x190), chambre 4 (1 lit 140x190). Canapé convertible (type Rapido, 2 personnes) au séjour. 1 salle de bains + 1 salle d''eau (douche) + 1 WC séparé.

Balcon sud avec mobilier de jardin et vue sur les pistes, parking privé, casier à skis privé. Lave-linge (partagé), WiFi, télévision (80 cm), lit bébé disponible. Animaux acceptés (supplément 40 € / séjour). Taxe de séjour 1 € / nuit / adulte.',
  '65 Chemin du Pessat, 74390 Châtel',
  46.2436, 6.8556, 1250,
  '["wifi","parking","lave_vaisselle","lave_linge_partage","television","casier_skis","balcon","vue_montagne","animaux_acceptes"]',
  '63038', 'publie'
);

-- Appartements 1 à 4 : EN BROUILLON, à compléter (capacités d'après la source : 7 ou 10 pers.)
INSERT INTO logements (id, proprietaire_id, type, nom, slug, capacite_max, nb_chambres, nb_sdb,
  description_courte, description_longue, adresse, latitude, longitude, altitude, equipements, statut) VALUES
  (4, 1, 'appartement', 'L''Étrye — Appartement 1', 'l-etrye-appartement-1', 10, 3, 1,
   'Appartement du chalet L''Étrye, face aux pistes du Linga. Fiche à compléter.',
   'Appartement situé dans le chalet L''Étrye à Châtel (hameau du Linga), face aux pistes, télécabine à 50 m. Surface, couchages et équipements à confirmer par le propriétaire.',
   '65 Chemin du Pessat, 74390 Châtel', 46.2436, 6.8556, 1250,
   '["wifi","parking","lave_linge_partage","casier_skis","balcon","vue_montagne"]', 'brouillon'),
  (5, 1, 'appartement', 'L''Étrye — Appartement 2', 'l-etrye-appartement-2', 7, 2, 1,
   'Appartement du chalet L''Étrye, face aux pistes du Linga. Fiche à compléter.',
   'Appartement situé dans le chalet L''Étrye à Châtel (hameau du Linga), face aux pistes, télécabine à 50 m. Surface, couchages et équipements à confirmer par le propriétaire.',
   '65 Chemin du Pessat, 74390 Châtel', 46.2436, 6.8556, 1250,
   '["wifi","parking","lave_linge_partage","casier_skis","balcon","vue_montagne"]', 'brouillon'),
  (6, 1, 'appartement', 'L''Étrye — Appartement 3', 'l-etrye-appartement-3', 10, 3, 1,
   'Appartement du chalet L''Étrye, face aux pistes du Linga. Fiche à compléter.',
   'Appartement situé dans le chalet L''Étrye à Châtel (hameau du Linga), face aux pistes, télécabine à 50 m. Surface, couchages et équipements à confirmer par le propriétaire.',
   '65 Chemin du Pessat, 74390 Châtel', 46.2436, 6.8556, 1250,
   '["wifi","parking","lave_linge_partage","casier_skis","balcon","vue_montagne"]', 'brouillon'),
  (7, 1, 'appartement', 'L''Étrye — Appartement 4', 'l-etrye-appartement-4', 7, 2, 1,
   'Appartement du chalet L''Étrye, face aux pistes du Linga. Fiche à compléter.',
   'Appartement situé dans le chalet L''Étrye à Châtel (hameau du Linga), face aux pistes, télécabine à 50 m. Surface, couchages et équipements à confirmer par le propriétaire.',
   '65 Chemin du Pessat, 74390 Châtel', 46.2436, 6.8556, 1250,
   '["wifi","parking","lave_linge_partage","casier_skis","balcon","vue_montagne"]', 'brouillon');

-- Photos (PLACEHOLDERS — à remplacer par les vraies photos via le back-office)
INSERT INTO photos (logement_id, url_r2, ordre, texte_alt, est_couverture) VALUES
  (8, '/images/placeholders/appart-vue.svg',     0, 'Vue sur les pistes du Linga', 1),
  (8, '/images/placeholders/appart-salon.svg',   1, 'Séjour', 0),
  (8, '/images/placeholders/appart-chambre.svg', 2, 'Chambre', 0),
  (8, '/images/placeholders/appart-cuisine.svg', 3, 'Cuisine intégrée', 0),
  (4, '/images/placeholders/appart-vue.svg', 0, 'Vue sur les pistes', 1),
  (5, '/images/placeholders/appart-vue.svg', 0, 'Vue sur les pistes', 1),
  (6, '/images/placeholders/appart-vue.svg', 0, 'Vue sur les pistes', 1),
  (7, '/images/placeholders/appart-vue.svg', 0, 'Vue sur les pistes', 1);

-- Tarifs de l'appartement 5 (ancres vérifiées : ~504–640 basse saison, ~740–810 été ;
-- les périodes d'hiver sont INDICATIVES, à confirmer par le propriétaire).
INSERT INTO tarifs (logement_id, nom_periode, date_debut, date_fin, prix_nuit, prix_semaine, nuits_minimum) VALUES
  (8, 'Été 2026',                    '2026-06-28', '2026-08-30', 130, 770, 7),
  (8, 'Basse saison',                '2026-08-30', '2026-12-19',  95, 560, 3),
  (8, 'Vacances de Noël (indicatif)','2026-12-19', '2027-01-02', 220, 1500, 7),
  (8, 'Janvier (indicatif)',         '2027-01-02', '2027-02-06', 140, 900, 7),
  (8, 'Vacances de février (indicatif)','2027-02-06','2027-03-06', 320, 2200, 7),
  (8, 'Mars (indicatif)',            '2027-03-06', '2027-04-12', 120, 750, 7);

UPDATE tarifs SET rythme = 'flexible' WHERE logement_id = 8 AND nuits_minimum < 7;
