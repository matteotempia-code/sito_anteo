#!/usr/bin/env node
/**
 * Copia in public/caratteri/ i due caratteri, solo sottoinsieme latino.
 *
 * Li prende dai pacchetti npm @fontsource-variable, che vanno installati
 * prima (`npm install`). Non scarica niente per conto suo: un carattere è
 * un binario che finisce nel sito pubblico, e deve venire da una fonte
 * dichiarata nel package.json, con la sua licenza, non da un indirizzo
 * scritto dentro uno script.
 *
 * I pacchetti contengono ogni sottoinsieme — latino, cirillico, greco,
 * vietnamita — per circa 300 KB. Qui si copia solo `latin`, che per un
 * sito italiano è l'unico che verrà mai usato.
 */
import { existsSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const qui = dirname(fileURLToPath(import.meta.url));
const radice = resolve(qui, '..');
const destinazione = resolve(radice, 'public/caratteri');

const SORGENTI = [
  {
    pacchetto: '@fontsource-variable/fraunces',
    /* Il file variabile con il solo sottoinsieme latino. Il nome esatto
       cambia fra versioni del pacchetto, quindi si cerca per forma. */
    cerca: /latin-.*-normal\.woff2$|latin\.woff2$/,
    destinazione: 'fraunces-latin.woff2',
    licenza: 'LICENSE',
    licenzaDestinazione: 'Fraunces-OFL.txt',
  },
  {
    pacchetto: '@fontsource-variable/public-sans',
    cerca: /latin-.*-normal\.woff2$|latin\.woff2$/,
    destinazione: 'public-sans-latin.woff2',
    licenza: 'LICENSE',
    licenzaDestinazione: 'PublicSans-OFL.txt',
  },
];

if (!existsSync(destinazione)) mkdirSync(destinazione, { recursive: true });

let mancanti = 0;

for (const s of SORGENTI) {
  const base = resolve(radice, 'node_modules', s.pacchetto);
  if (!existsSync(base)) {
    console.error(`  ✗ ${s.pacchetto} non è installato. Esegui prima: npm install`);
    mancanti++;
    continue;
  }
  const cartellaFile = join(base, 'files');
  const candidati = existsSync(cartellaFile)
    ? readdirSync(cartellaFile).filter((n) => s.cerca.test(n))
    : [];
  if (!candidati.length) {
    console.error(`  ✗ ${s.pacchetto}: nessun file «latin» trovato in files/`);
    mancanti++;
    continue;
  }
  /* Fra più candidati si prende il più piccolo: è il sottoinsieme stretto,
     non il latin-ext o il file completo. */
  candidati.sort((a, b) => a.length - b.length);
  copyFileSync(join(cartellaFile, candidati[0]), join(destinazione, s.destinazione));
  console.log(`  ✓ ${s.destinazione} ← ${s.pacchetto}/files/${candidati[0]}`);

  const lic = join(base, s.licenza);
  if (existsSync(lic)) {
    copyFileSync(lic, join(destinazione, s.licenzaDestinazione));
    console.log(`  ✓ ${s.licenzaDestinazione}`);
  } else {
    console.error(`  ✗ ${s.pacchetto}: licenza non trovata — non si distribuisce senza`);
    mancanti++;
  }
}

if (mancanti) {
  console.error(`\n✗ Caratteri: ${mancanti} problemi.`);
  process.exit(1);
}
console.log('✓ Caratteri pronti in public/caratteri/.');
