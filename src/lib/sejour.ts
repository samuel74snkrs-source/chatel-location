// Règles de séjour : haute saison = du samedi au samedi (multiples de 7 nuits),
// entre-saison = flexible (dates libres). Le rythme est porté par la période
// tarifaire couvrant la date d'arrivée.
import type { D1Database } from '@cloudflare/workers-types';

export type Rythme = 'samedi_samedi' | 'flexible';

export function nbNuits(arrivee: string, depart: string): number {
  return Math.round((Date.parse(depart + 'T00:00:00Z') - Date.parse(arrivee + 'T00:00:00Z')) / 86400000);
}

// Jour de la semaine en UTC (0 = dimanche … 6 = samedi).
function jour(iso: string): number {
  return new Date(iso + 'T00:00:00Z').getUTCDay();
}

// Détermine le rythme applicable à une date d'arrivée, d'après les périodes
// tarifaires (toutes annonces confondues — la saison est commune à la station).
// 'samedi_samedi' prime si une période haute saison couvre la date.
export async function rythmePourDate(DB: D1Database, dateISO: string): Promise<Rythme | null> {
  const row = await DB.prepare(
    `SELECT rythme FROM tarifs
      WHERE ? >= date_debut AND ? < date_fin
      ORDER BY (rythme = 'samedi_samedi') DESC
      LIMIT 1`
  ).bind(dateISO, dateISO).first<{ rythme: Rythme }>();
  return row?.rythme ?? null;
}

export interface Validation { ok: boolean; message?: string; }

// Valide une demande de dates selon le rythme. Si rythme inconnu (hors période
// définie), on reste permissif (au moins 1 nuit).
export function validerSejour(arrivee: string, depart: string, rythme: Rythme | null): Validation {
  if (!arrivee || !depart) return { ok: false, message: 'Indiquez les dates d’arrivée et de départ.' };
  const n = nbNuits(arrivee, depart);
  if (n <= 0) return { ok: false, message: 'La date de départ doit être postérieure à la date d’arrivée.' };

  if (rythme === 'samedi_samedi') {
    const okSamedis = jour(arrivee) === 6 && jour(depart) === 6;
    const okSemaines = n % 7 === 0 && n >= 7;
    if (!okSamedis || !okSemaines) {
      return {
        ok: false,
        message: 'En haute saison, les séjours se font du samedi au samedi (par semaines entières). Choisissez un samedi pour l’arrivée et le départ.',
      };
    }
  }
  // 'flexible' ou null : dates libres (le nuits_minimum éventuel est vérifié ailleurs).
  return { ok: true };
}

// Renvoie le prochain samedi (>= date donnée), au format YYYY-MM-DD. Utile pour
// suggérer/positionner les sélecteurs en haute saison.
export function prochainSamedi(dateISO: string): string {
  const d = new Date(dateISO + 'T00:00:00Z');
  const delta = (6 - d.getUTCDay() + 7) % 7;
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
