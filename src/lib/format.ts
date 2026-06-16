// Helpers de formatage (prix, dates) — locale FR par defaut.

export function prixEuro(montant: number | null | undefined): string {
  if (montant == null) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: montant % 1 === 0 ? 0 : 2,
  }).format(montant);
}

export function dateCourte(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

// Parse une liste d'equipements stockee en JSON (tolerant aux valeurs nulles/malformees).
export function parseEquipements(json: string | null): string[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}
