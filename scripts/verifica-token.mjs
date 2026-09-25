#!/usr/bin/env node
/**
 * Verifica che nessun componente scriva un valore a mano.
 *
 * Il prototipo aveva 26 corpi tipografici, 31 valori di spaziatura, 12 raggi
 * e 49 colori su otto schermate. Non era distrazione: era l'assenza di un
 * controllo che dicesse di no. Questo è quel controllo.
 *
 * Passano solo token.css (che i valori li definisce) e le poche eccezioni
 * dichiarate qui sotto con la loro ragione.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative, join } from 'node:path';

const qui = dirname(fileURLToPath(import.meta.url));
const radice = resolve(qui, '..');
const src = resolve(radice, 'src');

/**
 * File esentati, con la ragione.
 *
 * Erano tre. Una revisione ha fatto notare che le due esenzioni in più
 * coprivano esattamente i due file che contenevano colori scritti a mano:
 * un controllo che esenta proprio ciò che dovrebbe controllare non serve a
 * niente. Adesso quei colori sono token che non si invertono fra i temi
 * (--fondo-scuro, --su-scuro, --piede-fondo…) e l'esenzione è sparita.
 */
const ESENTI = new Map([['src/styles/token.css', 'definisce i token']]);

function tuttiIFile(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...tuttiIFile(p));
    else if (/\.(astro|css)$/.test(n)) out.push(p);
  }
  return out;
}

/** Valori tollerati ovunque: 0, 1px di bordo, le percentuali, i keyword. */
const PX_AMMESSI = new Set(['0px', '1px', '2px', '3px', '4px', '44px', '52px', '56px', '68px', '76px', '20px', '210px', '240px', '260px', '270px', '280px', '620px']);

const regole = [
  {
    nome: 'colore scritto a mano',
    re: /#[0-9a-fA-F]{3,8}\b/g,
    ok: () => false,
  },
  {
    nome: 'colore rgb()/hsl() scritto a mano',
    re: /\b(?:rgb|hsl)a?\(\s*\d/g,
    ok: () => false,
  },
  {
    nome: 'font-size fuori scala',
    re: /font-size:\s*([^;]+);/g,
    // `var(${...})` è un token scelto a runtime: la pagina del sistema
    // compone la scala leggendola da un elenco, non scrivendo le misure.
    ok: (v) =>
      v.includes('var(--corpo-') || v.includes('var(${') || v.includes('inherit') || v.includes('em'),
  },
  {
    nome: 'border-radius fuori scala',
    re: /border-radius:\s*([^;]+);/g,
    ok: (v) =>
      v.includes('var(--raggio') || v.includes('var(--sp-1)') || v.includes('50%') || v.includes('0'),
  },
];

let errori = 0;
let esaminati = 0;

for (const file of tuttiIFile(src)) {
  const rel = relative(radice, file).replaceAll('\\', '/');
  if (ESENTI.has(rel)) continue;
  esaminati++;

  const testo = readFileSync(file, 'utf8');
  // salta il frontmatter di Astro: lì i valori sono dati, non stile,
  // e i <meta>, dove il colore del tema va scritto in chiaro per forza
  // (nessun browser legge una variabile CSS in un attributo content).
  const corpo = (testo.startsWith('---') ? testo.slice(testo.indexOf('---', 3) + 3) : testo)
    .replace(/<meta\b[^>]*>/g, '');

  for (const regola of regole) {
    for (const m of corpo.matchAll(regola.re)) {
      const valore = (m[1] ?? m[0]).trim();
      if (regola.ok(valore)) continue;
      const riga = corpo.slice(0, m.index).split('\n').length;
      console.error(`  ✗ ${rel}:${riga} — ${regola.nome}: ${valore}`);
      errori++;
    }
  }

  // spaziature: ogni px che non sia nella lista degli ammessi
  for (const m of corpo.matchAll(/(?:margin|padding|gap|top|left|right|bottom|inset)[a-z-]*:\s*([^;]+);/g)) {
    for (const px of m[1].matchAll(/\b\d+px\b/g)) {
      if (PX_AMMESSI.has(px[0])) continue;
      const riga = corpo.slice(0, m.index).split('\n').length;
      console.error(`  ✗ ${rel}:${riga} — spaziatura fuori griglia: ${px[0]}`);
      errori++;
    }
  }
}

/* ------------------------------------------------------------------ *
 * Secondo controllo: ogni token citato deve esistere.
 *
 * Il primo controllo cerca valori scritti a mano; il verificatore dei
 * contrasti legge solo i token dichiarati. Fra i due c'era una crepa, e
 * dentro ci stavano --attenzione-testo e --attenzione-fondo: citati da
 * quattro componenti, dichiarati da nessuno. Un var() irrisolto non è un
 * errore per il browser: la dichiarazione salta e basta. Sulla pagina
 * diventava un filetto sparito e un fondo che non c'era — e nessuno dei
 * due controlli poteva vederlo.
 *
 * Qui si guardano anche gli script dell'anteprima, perché è lì che il
 * markup e lo stile delle schermate vivono davvero.
 * ------------------------------------------------------------------ */
const definiti = new Set();
const cssToken = readFileSync(resolve(src, 'styles/token.css'), 'utf8');
for (const m of cssToken.matchAll(/(--[a-z0-9-]+)\s*:/g)) definiti.add(m[1]);

const daControllare = [
  ...tuttiIFile(src),
  ...readdirSync(resolve(radice, 'scripts'))
    .filter((n) => n.endsWith('.mjs') && !n.startsWith('verifica-'))
    .map((n) => join(radice, 'scripts', n)),
];

/* Un token può essere dichiarato anche localmente: --campione-grafico vive
   solo nella pagina del sistema, --font-display nel :root dei generatori.
   Vale come dichiarazione: quello che si cerca qui è il token che NON è
   dichiarato da nessuna parte. */
const sorgenti = daControllare.map((f) => [f, readFileSync(f, 'utf8')]);
for (const [, testo] of sorgenti)
  for (const m of testo.matchAll(/(--[a-z0-9-]+)\s*:/g)) definiti.add(m[1]);

const mancanti = new Map();
for (const [file, testo] of sorgenti) {
  const rel = relative(radice, file).replaceAll('\\', '/');
  if (rel === 'src/styles/token.css') continue;
  // `var(--sp-${n})` è un token scelto a runtime: il nome non è scritto qui.
  for (const m of testo.matchAll(/var\(\s*(--[a-z0-9-]+)(\$\{)?/g)) {
    if (m[2] || definiti.has(m[1])) continue;
    const riga = testo.slice(0, m.index).split('\n').length;
    if (!mancanti.has(m[1])) mancanti.set(m[1], []);
    mancanti.get(m[1]).push(`${rel}:${riga}`);
  }
}

for (const [token, dove] of mancanti) {
  console.error(`  ✗ token citato ma mai dichiarato: ${token} — ${dove.slice(0, 4).join(', ')}${dove.length > 4 ? ` e altri ${dove.length - 4}` : ''}`);
  errori++;
}

if (errori) {
  console.error(`\n✗ Token: ${errori} problemi in ${esaminati} file.`);
  process.exit(1);
}
console.log(
  `✓ Token: ${esaminati} file esaminati, nessun valore scritto a mano; ` +
    `${definiti.size} token dichiarati, tutti quelli citati esistono.`,
);
