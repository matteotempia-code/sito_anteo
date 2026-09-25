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
 *
 * SUL NOME DEI FILE. La disposizione interna dei pacchetti fontsource
 * cambia fra versioni, e indovinarla sarebbe il modo più facile di far
 * fallire il build per un motivo stupido. Quindi lo script non indovina:
 * cerca ricorsivamente tutti i .woff2 del pacchetto, sceglie per criteri
 * dichiarati, e STAMPA che cosa ha scelto — così il registro del build
 * dice sempre quale file è finito nel sito.
 */
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative } from 'node:path';

const qui = dirname(fileURLToPath(import.meta.url));
const radice = resolve(qui, '..');
const destinazione = resolve(radice, 'public/caratteri');

const SORGENTI = [
  { pacchetto: '@fontsource-variable/fraunces', licenza: 'Fraunces-OFL.txt', prefisso: 'fraunces' },
  { pacchetto: '@fontsource-variable/public-sans', licenza: 'PublicSans-OFL.txt', prefisso: 'public-sans' },
];

/**
 * Due sottoinsiemi, non uno.
 *
 * `latin` copre l'italiano. `latin-ext` copre i nomi dell'Europa centrale e
 * orientale — Łukasz, Đorđe, Csaba — che in una cooperativa con duemila
 * professionisti e diciassettemila persone assistite non sono un caso di
 * scuola. Dichiarare l'intervallo esteso e servire solo il file `latin`,
 * come faceva la prima versione, è il peggio dei due mondi: il browser usa
 * il nostro carattere per le lettere che ci sono e quello di sistema per le
 * altre, dentro la stessa parola.
 *
 * Due @font-face con due intervalli distinti costano zero a chi legge: il
 * file esteso viene scaricato solo dalle pagine che contengono davvero
 * quelle lettere.
 */
const SOTTOINSIEMI = ['latin', 'latin-ext'];

/** Tutti i file sotto una cartella, ricorsivamente. */
function tutti(dir, dentro = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) tutti(p, dentro);
    else dentro.push(p);
  }
  return dentro;
}

/**
 * Sceglie il file giusto fra quelli del pacchetto.
 *
 * QUESTA FUNZIONE HA GIÀ SBAGLIATO UNA VOLTA, e vale la pena scrivere come.
 * La prima versione teneva i .woff2 «latin» non corsivi e fra quelli
 * prendeva IL PIÙ GRANDE, ragionando che più grande = più pesi dentro.
 * Per Public Sans andava bene, perché ha un asse solo. Fraunces ne ha
 * quattro — opsz (dimensione ottica), wght (peso), soft, wonk — e quindi
 * pubblica anche un file `full` con tutti gli assi insieme: 121 KB contro
 * i 36 del solo `wght`. «Il più grande» prendeva quello, e poi
 * verifica-caratteri.mjs lo rifiutava perché sopra il limite dei 90 KB.
 * Il build cadeva lì, con i due script che si contraddicevano.
 *
 * Adesso la scelta è dichiarata, in ordine, e non c'è più niente da
 * indovinare: di questo sito servono i PESI (500, 600, 700 per i titoli,
 * 400, 500, 600 per il testo), non le dimensioni ottiche né le varianti
 * calligrafiche. Quindi si vuole l'asse `wght` e nient'altro.
 */
const ORDINE = (sottoinsieme) => [
  {
    nome: 'asse dei pesi (wght)',
    prova: (n) => n.endsWith(`-${sottoinsieme}-wght-normal.woff2`),
  },
  {
    nome: 'variante standard',
    prova: (n) => n.endsWith(`-${sottoinsieme}-standard-normal.woff2`),
  },
];

function scegli(file, sottoinsieme) {
  const woff2 = file.filter((p) => p.endsWith('.woff2'));
  for (const criterio of ORDINE(sottoinsieme)) {
    const trovati = woff2.filter((p) => criterio.prova(p.split(/[\\/]/).pop()));
    if (trovati.length === 1) return { file: trovati[0], criterio: criterio.nome };
    if (trovati.length > 1) {
      /* Più di uno per lo stesso criterio: si prende il più PICCOLO, non il
         più grande. Fra due file che coprono entrambi quello che serve,
         quello in più è peso che qualcuno scarica. */
      trovati.sort((a, b) => statSync(a).size - statSync(b).size);
      return { file: trovati[0], criterio: `${criterio.nome} (il più leggero fra ${trovati.length})` };
    }
  }
  return null;
}

if (!existsSync(destinazione)) mkdirSync(destinazione, { recursive: true });

let mancanti = 0;

for (const s of SORGENTI) {
  const base = resolve(radice, 'node_modules', s.pacchetto);
  if (!existsSync(base)) {
    console.error(`  ✗ ${s.pacchetto} non è installato. Esegui prima: npm install`);
    mancanti++;
    continue;
  }

  const file = tutti(base);

  for (const sottoinsieme of SOTTOINSIEMI) {
    const esito = scegli(file, sottoinsieme);
    if (!esito) {
      console.error(
        `  ✗ ${s.pacchetto}: nessun .woff2 «${sottoinsieme}» con asse dei pesi.` +
          `\n    Nel pacchetto ci sono: ${file
            .filter((p) => p.endsWith('.woff2'))
            .map((p) => p.split(/[\\/]/).pop())
            .slice(0, 10)
            .join(', ')}`,
      );
      mancanti++;
      continue;
    }
    const nome = `${s.prefisso}-${sottoinsieme}.woff2`;
    copyFileSync(esito.file, join(destinazione, nome));
    console.log(
      `  ✓ ${nome} ← ${relative(base, esito.file)} ` +
        `(${Math.round(statSync(esito.file).size / 1024)} KB, scelto per: ${esito.criterio})`,
    );
  }

  const licenza = file.find((p) => /(licen[cs]e|ofl)/i.test(p.split(/[\\/]/).pop()));
  if (licenza) {
    copyFileSync(licenza, join(destinazione, s.licenza));
    console.log(`  ✓ ${s.licenza} ← ${relative(base, licenza)}`);
  } else {
    console.error(
      `  ✗ ${s.pacchetto}: licenza non trovata. I due caratteri sono sotto SIL Open Font` +
        ` License, che richiede di distribuirla insieme al file.`,
    );
    mancanti++;
  }
}

if (mancanti) {
  console.error(`\n✗ Caratteri: ${mancanti} problemi.`);
  process.exit(1);
}
console.log('✓ Caratteri pronti in public/caratteri/.');
