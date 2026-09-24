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

/** File esentati, con la ragione. */
const ESENTI = new Map([
  ['src/styles/token.css', 'definisce i token'],
  [
    'src/components/Piede.astro',
    'il piè di pagina è l’unico fondo scuro fisso: i suoi colori sono verificati a parte da verifica-contrasto',
  ],
  [
    'src/pages/index.astro',
    'il riquadro scuro della home usa gli stessi colori fissi del piè di pagina, verificati a parte',
  ],
]);

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

if (errori) {
  console.error(`\n✗ Token: ${errori} valori scritti a mano in ${esaminati} file.`);
  process.exit(1);
}
console.log(`✓ Token: ${esaminati} file esaminati, nessun valore scritto a mano.`);
