-- =====================================================================
-- Schema initial — Plateforme de reservation directe (Chatel)
-- Cloudflare D1 (SQLite). Voir cahier des charges section 5.
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- Proprietaires (membres famille) + administrateurs
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS proprietaires (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  nom             TEXT    NOT NULL,
  prenom          TEXT    NOT NULL,
  email           TEXT    NOT NULL UNIQUE,
  telephone       TEXT,
  role            TEXT    NOT NULL DEFAULT 'proprietaire'
                    CHECK (role IN ('proprietaire', 'admin')),
  mot_de_passe_hash TEXT,
  statut          TEXT    NOT NULL DEFAULT 'actif'
                    CHECK (statut IN ('actif', 'suspendu')),
  date_creation   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------
-- Logements (appartements / chalets)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS logements (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  proprietaire_id INTEGER NOT NULL REFERENCES proprietaires(id) ON DELETE CASCADE,
  type            TEXT    NOT NULL CHECK (type IN ('appartement', 'chalet')),
  nom             TEXT    NOT NULL,
  slug            TEXT    NOT NULL UNIQUE,          -- pour URL SEO : /logements/<slug>
  capacite_max    INTEGER NOT NULL,
  nb_chambres     INTEGER NOT NULL DEFAULT 0,
  nb_sdb          INTEGER NOT NULL DEFAULT 0,
  surface_m2      INTEGER,
  description_courte TEXT,
  description_longue TEXT,
  adresse         TEXT,
  latitude        REAL,
  longitude       REAL,
  altitude        INTEGER,
  equipements     TEXT,                              -- JSON : ["wifi","parking",...]
  numero_enregistrement_meuble TEXT,                 -- n. declaration mairie
  statut          TEXT    NOT NULL DEFAULT 'brouillon'
                    CHECK (statut IN ('brouillon', 'publie', 'masque')),
  date_creation   TEXT    NOT NULL DEFAULT (datetime('now')),
  date_maj        TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_logements_proprietaire ON logements(proprietaire_id);
CREATE INDEX IF NOT EXISTS idx_logements_statut       ON logements(statut);

-- ---------------------------------------------------------------------
-- Photos (stockees dans R2, on garde l'URL/cle ici)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS photos (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  logement_id   INTEGER NOT NULL REFERENCES logements(id) ON DELETE CASCADE,
  url_r2        TEXT    NOT NULL,
  ordre         INTEGER NOT NULL DEFAULT 0,
  texte_alt     TEXT,
  est_couverture INTEGER NOT NULL DEFAULT 0          -- bool (0/1)
);
CREATE INDEX IF NOT EXISTS idx_photos_logement ON photos(logement_id, ordre);

-- ---------------------------------------------------------------------
-- Tarifs par periode
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tarifs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  logement_id   INTEGER NOT NULL REFERENCES logements(id) ON DELETE CASCADE,
  nom_periode   TEXT    NOT NULL,                    -- ex : "Haute saison", "Vacances de Noel"
  date_debut    TEXT    NOT NULL,                    -- YYYY-MM-DD
  date_fin      TEXT    NOT NULL,                    -- YYYY-MM-DD
  prix_nuit     REAL,
  prix_semaine  REAL,
  nuits_minimum INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_tarifs_logement ON tarifs(logement_id, date_debut);

-- ---------------------------------------------------------------------
-- Disponibilites (occupation reelle, toutes sources confondues)
-- Cle anti double-booking : aucun chevauchement 'reserve' pour un meme logement.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS disponibilites (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  logement_id     INTEGER NOT NULL REFERENCES logements(id) ON DELETE CASCADE,
  date_debut      TEXT    NOT NULL,                  -- YYYY-MM-DD (arrivee)
  date_fin        TEXT    NOT NULL,                  -- YYYY-MM-DD (depart, exclu)
  statut          TEXT    NOT NULL DEFAULT 'reserve'
                    CHECK (statut IN ('libre', 'reserve', 'bloque')),
  source          TEXT    NOT NULL DEFAULT 'manuel'
                    CHECK (source IN ('direct', 'airbnb', 'booking', 'manuel')),
  reference_externe TEXT,                            -- UID de l'evenement iCal source
  date_creation   TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_dispo_logement ON disponibilites(logement_id, date_debut, date_fin);

-- ---------------------------------------------------------------------
-- Reservations
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservations (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  logement_id       INTEGER NOT NULL REFERENCES logements(id) ON DELETE RESTRICT,
  reference         TEXT    NOT NULL UNIQUE,         -- code lisible : "CHA-2026-0042"
  voyageur_nom      TEXT    NOT NULL,
  voyageur_email    TEXT    NOT NULL,
  voyageur_telephone TEXT,
  nb_personnes      INTEGER NOT NULL,
  date_arrivee      TEXT    NOT NULL,
  date_depart       TEXT    NOT NULL,
  nb_nuits          INTEGER NOT NULL,
  montant_total     REAL    NOT NULL DEFAULT 0,
  montant_acompte   REAL    NOT NULL DEFAULT 0,
  montant_solde     REAL    NOT NULL DEFAULT 0,
  montant_taxe_sejour REAL  NOT NULL DEFAULT 0,
  message           TEXT,                            -- message libre du voyageur
  statut            TEXT    NOT NULL DEFAULT 'en_attente'
                      CHECK (statut IN ('en_attente', 'confirmee', 'annulee')),
  statut_paiement   TEXT    NOT NULL DEFAULT 'impaye'
                      CHECK (statut_paiement IN ('impaye', 'acompte_paye', 'solde_paye')),
  date_creation     TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reservations_logement ON reservations(logement_id, date_arrivee);

-- ---------------------------------------------------------------------
-- Paiements (Stripe) — aucune donnee carte stockee ici
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paiements (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  reservation_id          INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  montant                 REAL    NOT NULL,
  type                    TEXT    NOT NULL CHECK (type IN ('acompte', 'solde')),
  statut                  TEXT    NOT NULL DEFAULT 'en_attente',
  date                    TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_paiements_reservation ON paiements(reservation_id);

-- ---------------------------------------------------------------------
-- Flux iCal (import OTA par logement)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS flux_ical (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  logement_id           INTEGER NOT NULL REFERENCES logements(id) ON DELETE CASCADE,
  plateforme            TEXT    NOT NULL CHECK (plateforme IN ('airbnb', 'booking', 'autre')),
  url_import            TEXT    NOT NULL,
  derniere_synchro      TEXT,
  statut_derniere_synchro TEXT  NOT NULL DEFAULT 'jamais'
);
CREATE INDEX IF NOT EXISTS idx_flux_logement ON flux_ical(logement_id);
