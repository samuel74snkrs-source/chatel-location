// Authentification : hachage de mot de passe (PBKDF2 via Web Crypto, dispo sur
// Cloudflare Workers) + sessions stockées dans KV + helpers cookies.
// Aucune dépendance externe, aucune donnée sensible en clair.
import type { D1Database, KVNamespace } from '@cloudflare/workers-types';

const PBKDF2_ITER = 100_000;
const COOKIE_NOM = 'phar_session';
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 jours

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'proprietaire' | 'admin';
}

// ---- Encodage base64 <-> octets ----
function octetsVersB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function b64VersOctets(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriver(motDePasse: string, sel: Uint8Array, iterations: number): Promise<ArrayBuffer> {
  const cle = await crypto.subtle.importKey('raw', new TextEncoder().encode(motDePasse), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', salt: sel, iterations, hash: 'SHA-256' }, cle, 256);
}

// Format stocké : pbkdf2$<iterations>$<selB64>$<hashB64>
export async function hacherMotDePasse(motDePasse: string): Promise<string> {
  const sel = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriver(motDePasse, sel, PBKDF2_ITER);
  return `pbkdf2$${PBKDF2_ITER}$${octetsVersB64(sel.buffer)}$${octetsVersB64(hash)}`;
}

export async function verifierMotDePasse(motDePasse: string, stocke: string | null): Promise<boolean> {
  if (!stocke) return false;
  const [algo, iterStr, selB64, hashB64] = stocke.split('$');
  if (algo !== 'pbkdf2') return false;
  const sel = b64VersOctets(selB64);
  const attendu = b64VersOctets(hashB64);
  const calcule = new Uint8Array(await deriver(motDePasse, sel, Number(iterStr)));
  if (calcule.length !== attendu.length) return false;
  // Comparaison à temps constant.
  let diff = 0;
  for (let i = 0; i < calcule.length; i++) diff |= calcule[i] ^ attendu[i];
  return diff === 0;
}

// ---- Sessions (KV) ----
export async function creerSession(KV: KVNamespace, utilisateur: Utilisateur): Promise<string> {
  const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
  await KV.put(`session:${token}`, JSON.stringify({ id: utilisateur.id }), { expirationTtl: SESSION_TTL });
  return token;
}

export async function utilisateurDepuisRequete(
  request: Request,
  KV: KVNamespace,
  DB: D1Database
): Promise<Utilisateur | null> {
  const token = lireCookie(request, COOKIE_NOM);
  if (!token) return null;
  const brut = await KV.get(`session:${token}`);
  if (!brut) return null;
  let id: number;
  try { id = JSON.parse(brut).id; } catch { return null; }
  const u = await DB.prepare(
    `SELECT id, nom, prenom, email, role FROM proprietaires WHERE id = ? AND statut = 'actif'`
  ).bind(id).first<Utilisateur>();
  return u ?? null;
}

export async function detruireSession(KV: KVNamespace, request: Request): Promise<void> {
  const token = lireCookie(request, COOKIE_NOM);
  if (token) await KV.delete(`session:${token}`);
}

// ---- Cookies ----
export function lireCookie(request: Request, nom: string): string | null {
  const entete = request.headers.get('Cookie');
  if (!entete) return null;
  for (const part of entete.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === nom) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function cookieSession(token: string, secure: boolean): string {
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${SESSION_TTL}`];
  if (secure) attrs.push('Secure');
  return `${COOKIE_NOM}=${encodeURIComponent(token)}; ${attrs.join('; ')}`;
}

export function cookieDeconnexion(secure: boolean): string {
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (secure) attrs.push('Secure');
  return `${COOKIE_NOM}=; ${attrs.join('; ')}`;
}
