#!/usr/bin/env node
/**
 * Verifica il contrasto di tutte le coppie che contano, leggendole dai token.
 *
 * Non è una checklist: è un controllo che fallisce. Se qualcuno schiarisce un
 * colore di testo o scurisce un fondo, la pubblicazione si ferma qui invece
 * che in un audit fra sei mesi.
 *
 * Soglie WCAG 2.2 AA:
 *   · testo normale su fondo ............ 4,5:1
 *   · testo grande (≥ 24 px) ............ 3:1
 *   · bordi e componenti non testuali ... 3:1
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const qui = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(qui, '../src/styles/token.css'), 'utf8');

/** Estrae i token di un blocco, identificato dal suo selettore. */
function blocco(selettore) {
  const i = css.indexOf(selettore);
  if (i < 0) throw new Error(`Blocco non trovato: ${selettore}`);
  const apre = css.indexOf('{', i);
  let livello = 0;
  let j = apre;
  for (; j < css.length; j++) {
    if (css[j] === '{') livello++;
    else if (css[j] === '}') {
      livello--;
      if (livello === 0) break;
    }
  }
  const corpo = css.slice(apre + 1, j);
  const token = {};
  for (const m of corpo.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    token[m[1]] = m[2];
  }
  return token;
}

const chiaro = blocco(':root {');
const scuro = blocco(":root[data-tema='scuro']");

function rgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function luminanza(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rapporto(a, b) {
  const la = luminanza(a);
  const lb = luminanza(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Le coppie da verificare. [testo, fondo, soglia, descrizione] */
function coppie(t) {
  const fondi = ['--fondo', '--superficie', '--superficie-alt'];
  const testi = ['--inchiostro', '--testo', '--testo-secondario', '--testo-tenue'];
  const out = [];

  for (const f of fondi) {
    for (const x of testi) out.push([x, f, 4.5, 'testo su fondo']);
    out.push(['--primario', f, 4.5, 'collegamento su fondo']);
  }

  // le pillole e i riquadri di settore: testo sulla propria tinta tenue
  for (const s of [
    'salute-mentale',
    'anziani',
    'disabilita',
    'minori',
    'dipendenze',
    'sociale',
  ]) {
    out.push([`--${s}-testo`, `--${s}-fondo`, 4.5, `pillola ${s}`]);
    out.push([`--${s}-testo`, '--fondo', 4.5, `testo ${s} sul fondo pagina`]);
    out.push([`--${s}-grafico`, '--superficie', 3, `filetto ${s} su superficie`]);
  }

  for (const s of ['positivo', 'attenzione', 'critico']) {
    out.push([`--${s}-testo`, `--${s}-fondo`, 4.5, `stato ${s}`]);
  }

  // i controlli
  out.push(['--bordo-controllo', '--superficie', 3, 'bordo dei campi']);
  out.push(['--bordo-opzione', '--superficie', 3, 'bordo delle opzioni non selezionate']);
  out.push(['--primario', '--superficie', 3, 'contorno di focus']);

  // l'azione primaria: testo chiaro sul viola
  out.push(['--superficie', '--primario', 4.5, 'testo dell’azione primaria']);
  out.push(['--primario', '--primario-chiaro', 4.5, 'testo primario su fondo tenue']);
  // --primario-bordo non è qui: delimita un riquadro decorativo, non un
  // controllo da usare, e non porta informazione che serva a capire la
  // pagina. La soglia 1.4.11 vale per i controlli e per i segni che sono
  // l'unico veicolo di un'informazione: quelli sono già tutti sopra.

  return out.map(([a, b, soglia, cosa]) => ({ a, b, soglia, cosa }));
}

let errori = 0;
let controlli = 0;

for (const [tema, token] of [
  ['chiaro', chiaro],
  ['scuro', { ...chiaro, ...scuro }],
]) {
  for (const { a, b, soglia, cosa } of coppie(token)) {
    const ca = token[a];
    const cb = token[b];
    if (!ca || !cb) {
      console.error(`  ✗ [${tema}] token mancante: ${!ca ? a : b}`);
      errori++;
      continue;
    }
    controlli++;
    const r = rapporto(ca, cb);
    if (r < soglia) {
      console.error(
        `  ✗ [${tema}] ${cosa}: ${a} (${ca}) su ${b} (${cb}) = ${r.toFixed(2)}:1, serve ${soglia}:1`,
      );
      errori++;
    }
  }
}

// Il piè di pagina ha colori propri, perché è l'unico fondo scuro fisso.
const PIEDE = [
  ['#d9d2e4', '#241c33', 4.5, 'testo del piè di pagina'],
  ['#e6e0ee', '#241c33', 4.5, 'collegamenti del piè di pagina'],
  ['#a99cbe', '#241c33', 4.5, 'titoletti e nota del piè di pagina'],
  ['#b7abc9', '#241c33', 4.5, 'recapiti del piè di pagina'],
  ['#ffffff', '#241c33', 4.5, 'nome nel piè di pagina'],
  ['#ded4ee', '#4a3468', 4.5, 'barra di servizio in testata'],
  ['#ffffff', '#4a3468', 4.5, 'numero verde nella barra di servizio'],
  ['#ffffff', '#4a3468', 4.5, 'titolo del riquadro scuro in home'],
  ['#efeaf6', '#4a3468', 4.5, 'testo del riquadro scuro in home'],
  ['#cbbde3', '#4a3468', 4.5, 'occhiello del riquadro scuro in home'],
  ['#4a3468', '#ffffff', 4.5, 'azione bianca nel riquadro scuro'],
];

for (const [a, b, soglia, cosa] of PIEDE) {
  controlli++;
  const r = rapporto(a, b);
  if (r < soglia) {
    console.error(`  ✗ [fisso] ${cosa}: ${a} su ${b} = ${r.toFixed(2)}:1, serve ${soglia}:1`);
    errori++;
  }
}

if (errori) {
  console.error(`\n✗ Contrasto: ${errori} coppie sotto soglia su ${controlli} verificate.`);
  process.exit(1);
}
console.log(`✓ Contrasto: ${controlli} coppie verificate, tutte a norma.`);
