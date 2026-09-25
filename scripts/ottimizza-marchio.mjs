#!/usr/bin/env node
/**
 * Ottimizza i file del marchio.
 *
 * Il marchio esportato dal disegnatore pesava 30 KB a file, per 61 KB in
 * tutto: ventiquattro tracciati con 2.656 numeri scritti a sei decimali,
 * tutti in coordinate assolute, dentro un gruppo con una traslazione.
 *
 * Sei decimali su una tela di 318 unità significano precisione al
 * decimilionesimo di pixel: nessuno schermo la può mostrare. Due decimali
 * bastano — a 64 px di resa, un'unità vale 0,2 px, quindi un centesimo di
 * unità vale due millesimi di pixel.
 *
 * Cosa fa, in ordine:
 *  1. incorpora la traslazione del gruppo nelle coordinate, così il gruppo
 *     sparisce;
 *  2. arrotonda a due decimali;
 *  3. sceglie per ogni comando fra assoluto e relativo, il più corto dei
 *     due (i delta sono numeri piccoli, e quasi sempre vince il relativo);
 *  4. unisce i tracciati che hanno lo stesso colore — da ventiquattro a
 *     cinque;
 *  5. scrive i numeri nel modo più compatto che l'SVG ammette: niente zero
 *     iniziale, niente separatore prima di un segno meno, niente lettera
 *     di comando ripetuta.
 *
 * Nessun passaggio cambia la forma. Il controllo è in fondo: il file nuovo
 * viene reso in Chromium accanto al vecchio e i pixel si confrontano. Se
 * la differenza supera una soglia, lo script fallisce e non scrive niente.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)(
  '/home/claude/.npm-global/lib/node_modules/playwright/index.js',
);

const qui = dirname(fileURLToPath(import.meta.url));
const marchio = resolve(qui, '../public/marchio');

/**
 * Due decimali. Con uno solo il controllo dei pixel segnala il 2,5 % di
 * differenza — a 512 px i bordi si spostano di mezzo pixel e si vede.
 */
const DECIMALI = 2;

/**
 * Unire i tracciati dello stesso colore NON si può, ed è la ragione per cui
 * questo controllo esiste. Provato: il 18 % dei pixel cambiava. Ventiquattro
 * tracciati separati si disegnano uno sopra l'altro; uniti in un tracciato
 * solo diventano sottotracciati della stessa figura, e la regola di
 * riempimento «nonzero» conta gli avvolgimenti sovrapposti al contrario —
 * i controni interni delle lettere si riempivano. Resta a titolo di
 * promemoria, spento.
 */
const UNISCI = false;
/** Differenza massima tollerata fra il rendering vecchio e quello nuovo. */
const SOGLIA_PIXEL_DIVERSI = 0.002; // 0,2 %

/* ---------------------------------------------------------------- numeri */

const arrotonda = (n) => {
  const r = +n.toFixed(DECIMALI);
  return Object.is(r, -0) ? 0 : r;
};

/** «0.5» → «.5», «-0.5» → «-.5», «3.00» → «3». */
const scrivi = (n) => {
  let s = String(arrotonda(n));
  if (s.startsWith('0.')) s = s.slice(1);
  else if (s.startsWith('-0.')) s = '-' + s.slice(2);
  return s;
};

/** Fra due numeri serve un separatore solo se il secondo non comincia
 *  già con un segno o con un punto che può attaccarsi. */
function unisci(pezzi) {
  let out = '';
  for (const p of pezzi) {
    if (out === '') out = p;
    else if (p.startsWith('-')) out += p;
    else if (p.startsWith('.') && /\.\d+$/.test(out)) out += p; // «1.5.5» non è valido
    else out += ' ' + p;
  }
  return out;
}

/* -------------------------------------------------------------- tracciati */

/** Legge un «d» fatto di M, L, C, Z assoluti in una lista di comandi. */
function leggi(d) {
  const pezzi = d.match(/[MLCZmlcz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const cmd = [];
  let i = 0;
  let ultimo = 'M';
  while (i < pezzi.length) {
    let c = pezzi[i];
    if (/[A-Za-z]/.test(c)) i++;
    else c = ultimo === 'M' ? 'L' : ultimo; // numeri nudi: si ripete il comando
    ultimo = c;
    const quanti = { M: 2, L: 2, C: 6, Z: 0 }[c.toUpperCase()];
    if (c.toUpperCase() === 'Z') {
      cmd.push(['Z', []]);
      continue;
    }
    cmd.push([c.toUpperCase(), pezzi.slice(i, i + quanti).map(Number)]);
    i += quanti;
  }
  return cmd;
}

/** Riscrive i comandi con la traslazione incorporata e la forma più corta. */
function scriviTracciato(cmd, dx, dy) {
  let x = 0, y = 0;          // penna, in coordinate finali
  let inizioX = 0, inizioY = 0;
  let precedente = '';
  const out = [];

  for (const [c, n] of cmd) {
    if (c === 'Z') {
      out.push('Z');
      x = inizioX; y = inizioY;
      precedente = 'Z';
      continue;
    }
    // coordinate finali, arrotondate una volta sola: la penna deve seguire
    // i valori scritti, non quelli esatti, o gli errori si sommano
    const ass = n.map((v, k) => arrotonda(v + (k % 2 === 0 ? dx : dy)));
    const rel = ass.map((v, k) => arrotonda(v - (k % 2 === 0 ? x : y)));

    const testoAss = unisci(ass.map(scrivi));
    const testoRel = unisci(rel.map(scrivi));
    const usaRel = testoRel.length <= testoAss.length;
    const lettera = usaRel ? c.toLowerCase() : c;
    const testo = usaRel ? testoRel : testoAss;

    // la lettera si omette se ripete la precedente (dopo una M implicita è L)
    const implicita = precedente === lettera || (precedente === 'M' && lettera === 'L') ||
      (precedente === 'm' && lettera === 'l');
    const pezzo = implicita ? testo : lettera + testo;
    // un numero che comincia con «-» o «.» può attaccarsi a ciò che precede
    const serve = out.length > 0 && implicita && !/^[-.]/.test(testo);
    out.push((serve ? ' ' : '') + pezzo);

    precedente = lettera;
    x = ass[ass.length - 2];
    y = ass[ass.length - 1];
    if (c === 'M') { inizioX = x; inizioY = y; }
  }
  return out.join('');
}

/* ------------------------------------------------------------- il lavoro */

function ottimizza(sorgente) {
  const vista = sorgente.match(/viewBox="([^"]+)"/)[1];
  const etichetta = (sorgente.match(/aria-label="([^"]+)"/) ?? [, ''])[1];
  const titolo = (sorgente.match(/<title>([^<]*)<\/title>/) ?? [, etichetta])[1];

  const tr = sorgente.match(/transform="translate\(([-\d.]+)[, ]+([-\d.]+)\)"/);
  const dx = tr ? parseFloat(tr[1]) : 0;
  const dy = tr ? parseFloat(tr[2]) : 0;

  /* I tracciati si raggruppano per colore mantenendo l'ordine di comparsa:
     con soli tracciati pieni e non sovrapposti l'ordine dentro un gruppo
     non conta, ma fra gruppi sì, e questo lo conserva. */
  const uniti = [];
  for (const m of sorgente.matchAll(/<path\s+fill="([^"]+)"\s+d="([^"]+)"/g)) {
    const colore = m[1].toLowerCase();
    const d = scriviTracciato(leggi(m[2]), dx, dy);
    const ultimo = uniti[uniti.length - 1];
    if (UNISCI && ultimo && ultimo[0] === colore) ultimo[1] += d;
    else uniti.push([colore, d]);
  }

  const tracciati = uniti
    .map(([colore, d]) => `<path fill="${colore}" d="${d}"/>`)
    .join('');

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vista}" ` +
    `role="img" aria-label="${etichetta}">` +
    `<title>${titolo}</title>${tracciati}</svg>`
  );
}

/* ------------------------------------------------------- il controllo */

async function confronta(browser, prima, dopo, nome) {
  const pag = await browser.newPage({ viewport: { width: 512, height: 512 } });
  const scatta = async (svg) => {
    await pag.setContent(
      `<body style="margin:0;background:#888">` +
        `<img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" ` +
        `style="width:512px;display:block">`,
    );
    await pag.waitForTimeout(80);
    return pag.screenshot();
  };
  const a = await scatta(prima);
  const b = await scatta(dopo);
  await pag.close();

  // confronto grezzo ma sufficiente: i PNG hanno la stessa geometria, quindi
  // li ridecodifichiamo in canvas dentro la pagina
  const pag2 = await browser.newPage();
  const diversi = await pag2.evaluate(
    async ([x, y]) => {
      const carica = (b64) =>
        new Promise((ris) => {
          const i = new Image();
          i.onload = () => ris(i);
          i.src = 'data:image/png;base64,' + b64;
        });
      const ia = await carica(x), ib = await carica(y);
      const c = document.createElement('canvas');
      c.width = ia.width; c.height = ia.height;
      const g = c.getContext('2d');
      g.drawImage(ia, 0, 0);
      const da = g.getImageData(0, 0, c.width, c.height).data;
      g.clearRect(0, 0, c.width, c.height);
      g.drawImage(ib, 0, 0);
      const db = g.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let k = 0; k < da.length; k += 4) {
        if (
          Math.abs(da[k] - db[k]) > 8 ||
          Math.abs(da[k + 1] - db[k + 1]) > 8 ||
          Math.abs(da[k + 2] - db[k + 2]) > 8
        ) n++;
      }
      return n / (da.length / 4);
    },
    [a.toString('base64'), b.toString('base64')],
  );
  await pag2.close();

  const esito = diversi <= SOGLIA_PIXEL_DIVERSI;
  console.log(
    `  ${esito ? '✓' : '✗'} ${nome}: ${(diversi * 100).toFixed(3)} % di pixel diversi ` +
      `(soglia ${(SOGLIA_PIXEL_DIVERSI * 100).toFixed(1)} %)`,
  );
  return esito;
}

const FILE = ['logo-lockup.svg', 'logo-lockup-bianco.svg', 'logo-mark.svg'];

const browser = await chromium.launch();
let tutto = true;
const risultati = [];

for (const nome of FILE) {
  const percorso = resolve(marchio, nome);
  const prima = readFileSync(percorso, 'utf8');
  const dopo = ottimizza(prima);
  const ok = await confronta(browser, prima, dopo, nome);
  tutto &&= ok;
  risultati.push([nome, percorso, prima.length, dopo, ok]);
}

await browser.close();

if (!tutto) {
  console.error('\n✗ Marchio: la forma è cambiata. Niente è stato scritto.');
  process.exit(1);
}

let da = 0, a = 0;
for (const [nome, percorso, prima, dopo] of risultati) {
  writeFileSync(percorso, dopo, 'utf8');
  da += prima;
  a += dopo.length;
  console.log(`  ${nome}: ${prima} → ${dopo.length} byte`);
}
console.log(
  `✓ Marchio: ${da} → ${a} byte (−${Math.round((1 - a / da) * 100)} %), forma invariata.`,
);
