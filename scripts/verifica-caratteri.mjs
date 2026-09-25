#!/usr/bin/env node
/**
 * Verifica che i caratteri auto-ospitati ci siano davvero.
 *
 * Perché serve un controllo per due file. Perché il modo in cui questa cosa
 * fallisce è silenzioso: se i .woff2 non sono in public/caratteri/, il
 * browser non protesta — ricade sul carattere di sistema e la pagina si
 * vede lo stesso, solo in Georgia e Arial invece che in Fraunces e Public
 * Sans. Nessun errore in console, nessuna pagina rotta, nessuna
 * segnalazione: solo un sito che non è più il sito. Con un `@font-face`
 * che punta a un file inesistente ci si accorge del problema quando lo fa
 * notare qualcuno da fuori.
 *
 * Perché i file non stanno nel repository: sono binari, e un binario in git
 * si porta dietro ogni sua versione per sempre. Li mette `npm run caratteri`
 * dai pacchetti @fontsource-variable, che è anche il posto da cui arrivano
 * le licenze.
 */
import { existsSync, statSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const qui = dirname(fileURLToPath(import.meta.url));
const cartella = resolve(qui, '../public/caratteri');

/**
 * Nome del file e peso massimo ragionevole.
 *
 * Il limite non è pedanteria: è il controllo che ha preso il difetto vero.
 * La prima versione dello script di copia sceglieva «il .woff2 latino più
 * grande», e per Fraunces quello è `full` — tutti e quattro gli assi
 * insieme, 121 KB invece dei 36 del solo asse dei pesi. Il limite l'ha
 * rifiutato e il build è caduto, che è esattamente quello che doveva
 * succedere. Sotto, i pesi veri dei file giusti, con margine.
 */
const ATTESI = [
  ['fraunces-latin.woff2', 60_000],
  ['fraunces-latin-ext.woff2', 60_000],
  ['public-sans-latin.woff2', 45_000],
  ['public-sans-latin-ext.woff2', 45_000],
];

/* Le licenze vanno distribuite insieme ai caratteri: Fraunces e Public Sans
   sono entrambi sotto SIL Open Font License, che lo richiede. */
const LICENZE = ['Fraunces-OFL.txt', 'PublicSans-OFL.txt'];

let errori = 0;

if (!existsSync(cartella)) {
  console.error(`  ✗ manca la cartella public/caratteri/`);
  errori++;
} else {
  for (const [nome, limite] of ATTESI) {
    const p = join(cartella, nome);
    if (!existsSync(p)) {
      console.error(`  ✗ manca ${nome}`);
      errori++;
      continue;
    }
    const peso = statSync(p).size;
    if (peso === 0) {
      console.error(`  ✗ ${nome} è vuoto`);
      errori++;
    } else if (peso > limite) {
      console.error(
        `  ✗ ${nome} pesa ${Math.round(peso / 1024)} KB: troppo per il solo sottoinsieme ` +
          `latino (limite ${Math.round(limite / 1024)} KB). Probabilmente è il file completo, ` +
          `con cirillico, greco e vietnamita.`,
      );
      errori++;
    } else {
      console.log(`  ✓ ${nome}: ${Math.round(peso / 1024)} KB`);
    }
  }
  for (const nome of LICENZE) {
    if (!existsSync(join(cartella, nome))) {
      console.error(`  ✗ manca la licenza ${nome} (SIL OFL: va distribuita con il carattere)`);
      errori++;
    }
  }
  const estranei = readdirSync(cartella).filter(
    (n) => !ATTESI.some(([a]) => a === n) && !LICENZE.includes(n) && n !== 'LEGGIMI.md',
  );
  if (estranei.length) {
    console.error(
      `  ✗ file non previsti in public/caratteri/: ${estranei.join(', ')} — ` +
        `ogni carattere in più è peso che qualcuno scarica`,
    );
    errori++;
  }
}

if (errori) {
  console.error(
    `\n✗ Caratteri: ${errori} problemi. Il sito si vedrebbe lo stesso, in Georgia e Arial,` +
      `\n  senza che niente lo segnali. Esegui: npm run caratteri`,
  );
  process.exit(1);
}
console.log('✓ Caratteri: auto-ospitati, solo latino, con le licenze.');
