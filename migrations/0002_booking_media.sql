-- =====================================================================
-- Migration 0002 — règles de séjour + médias de site
-- Additive : ne supprime aucune donnée.
-- =====================================================================

-- Rythme de réservation par période tarifaire :
--   'samedi_samedi' = haute saison (séjours du samedi au samedi, multiples de 7 nuits)
--   'flexible'      = entre-saison (dates libres, respect du nuits_minimum)
ALTER TABLE tarifs ADD COLUMN rythme TEXT NOT NULL DEFAULT 'samedi_samedi';

-- Les périodes à faible minimum de nuits sont considérées flexibles (entre-saison).
UPDATE tarifs SET rythme = 'flexible' WHERE nuits_minimum < 7;

-- Médias éditoriaux du site (indépendants des logements) : ex. image hero d'accueil,
-- galerie d'accueil, futures pages de contenu. Stockés dans R2 (url_r2 = clé).
CREATE TABLE IF NOT EXISTS medias_site (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  emplacement   TEXT    NOT NULL,        -- ex : 'accueil_hero', 'accueil_galerie'
  url_r2        TEXT    NOT NULL,
  ordre         INTEGER NOT NULL DEFAULT 0,
  texte_alt     TEXT,
  date_creation TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_medias_emplacement ON medias_site(emplacement, ordre);
