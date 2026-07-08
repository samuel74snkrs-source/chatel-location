-- =====================================================================
-- Migration 0003 — intégration SuperHôte (channel manager)
-- Additive : ne supprime aucune donnée.
-- =====================================================================

-- Clé du bien dans SuperHôte (PropertyKey), pour cibler le widget de réservation.
ALTER TABLE logements ADD COLUMN superhote_property_key TEXT;

-- Paramètres généraux du site (clé/valeur) : ex. 'superhote_webkey'.
CREATE TABLE IF NOT EXISTS parametres (
  cle    TEXT PRIMARY KEY,
  valeur TEXT
);
