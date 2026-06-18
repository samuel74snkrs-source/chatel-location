// Génère un fichier SQL (gitignoré) qui définit les mots de passe des comptes,
// en utilisant le MÊME hachage PBKDF2 que le serveur (src/lib/auth.ts).
// Usage :
//   node scripts/set-passwords.mjs "email1=motdepasse1" "email2=motdepasse2"
// Puis appliquer :
//   npx wrangler d1 execute DB --local  --file=./seed/_passwords.local.sql
//   npx wrangler d1 execute DB --remote --file=./seed/_passwords.local.sql
import { writeFileSync } from 'node:fs';

const ITER = 100_000;

function b64(buf) {
  return Buffer.from(new Uint8Array(buf)).toString('base64');
}

async function hacher(motDePasse) {
  const sel = crypto.getRandomValues(new Uint8Array(16));
  const cle = await crypto.subtle.importKey('raw', new TextEncoder().encode(motDePasse), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: sel, iterations: ITER, hash: 'SHA-256' }, cle, 256);
  return `pbkdf2$${ITER}$${b64(sel.buffer)}$${b64(hash)}`;
}

const paires = process.argv.slice(2);
if (paires.length === 0) {
  console.error('Aucune paire email=motdepasse fournie.');
  process.exit(1);
}

let sql = '-- Mots de passe (généré, NE PAS committer)\n';
for (const p of paires) {
  const i = p.indexOf('=');
  const email = p.slice(0, i).trim();
  const mdp = p.slice(i + 1);
  const hash = await hacher(mdp);
  const emailEsc = email.replace(/'/g, "''");
  const hashEsc = hash.replace(/'/g, "''");
  sql += `UPDATE proprietaires SET mot_de_passe_hash = '${hashEsc}' WHERE lower(email) = lower('${emailEsc}');\n`;
  console.log(`OK  ${email}`);
}

writeFileSync(new URL('../seed/_passwords.local.sql', import.meta.url), sql, 'utf8');
console.log('-> seed/_passwords.local.sql écrit.');
