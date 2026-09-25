#!/usr/bin/env node
/**
 * Verifica il contrasto di ogni coppia che porta informazione, nei due temi.
 *
 * SECONDA VERSIONE, riscritta dopo una revisione che ha trovato un difetto
 * che questo controllo lasciava passare.
 *
 * Il difetto: una fascia della pagina iniziale usava `--primario-scuro` come
 * FONDO con testo bianco sopra. In tema chiaro `--primario-scuro` vale
 * #4a3468 e il rapporto è 11:1. In tema scuro quel token si schiarisce a
 * #c9b4ec, e il bianco sopra scende a 1,87:1 — testo invisibile.
 *
 * Perché non se ne accorgeva: la prima versione confrontava un elenco di
 * VALORI LETTERALI scritti a mano, che duplicava a memoria quelli dei
 * componenti. Duplicare a memoria è il modo in cui un controllo diventa
 * decorativo: l'elenco era già fuori sincrono su una coppia.
 *
 * Adesso le coppie si dichiarano per NOME DI TOKEN e vengono risolte nei
 * due temi, e un secondo controllo (verifica-token) garantisce che nei
 * componenti non esistano colori scritti a mano — così non c'è più niente
 * che possa divergere.
 *
 * Soglie WCAG 2.2 AA: 4,5:1 per il testo, 3:1 per bordi e componenti.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const qui = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(qui, '../src/styles/token.css'), 'utf8');

function blocco(selettore) {
  const i = css.indexOf(selettore);
  if (i < 0) throw new Error(`Blocco non trovato: ${selettore}`);
  const apre = css.indexOf('{', i);
  let livello = 0, j = apre;
  for (; j < css.length; j++) {
    if (css[j] === '{') livello++;
    else if (css[j] === '}' && --livello === 0) break;
  }
  const token = {};
  for (const m of css.slice(apre + 1, j).matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    token[m[1]] = m[2];
  }
  return token;
}

const CHIARO = blocco(':root {');
const SCURO = { ...CHIARO, ...blocco(":root[data-tema='scuro']") };

const rgb = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const luminanza = (hex) =>
  rgb(hex)
    .map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; })
    .reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const rapporto = (a, b) => {
  const la = luminanza(a), lb = luminanza(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const SETTORI = ['salute-mentale', 'anziani', 'disabilita', 'minori', 'dipendenze', 'sociale'];

/** [testo, fondo, soglia, descrizione] — sempre nomi di token, mai valori. */
const COPPIE = [];
const agg = (a, b, soglia, cosa) => COPPIE.push([a, b, soglia, cosa]);

// testo su ciascuna delle tre superfici chiare
for (const f of ['--fondo', '--superficie', '--superficie-alt']) {
  for (const t of ['--inchiostro', '--testo', '--testo-secondario', '--testo-tenue']) {
    agg(t, f, 4.5, `testo su ${f}`);
  }
  agg('--primario', f, 4.5, `collegamento su ${f}`);
}

// i settori: pillola sulla propria tinta tenue, testo sul fondo pagina,
// filetto come segno grafico
for (const s of SETTORI) {
  agg(`--${s}-testo`, `--${s}-fondo`, 4.5, `pillola ${s}`);
  agg(`--${s}-testo`, '--fondo', 4.5, `testo ${s} sul fondo pagina`);
  agg(`--${s}-testo`, '--superficie', 4.5, `testo ${s} su scheda`);
  agg(`--${s}-grafico`, '--superficie', 3, `filetto ${s} su scheda`);
  agg(`--${s}-grafico`, '--fondo', 3, `filetto ${s} sul fondo pagina`);
}

// i valori di ripiego di --filetto/--tinta/--velo, per quando un blocco
// perde per strada la classe di settore: devono reggere come i veri
agg('--tinta', '--superficie', 4.5, 'tinta di ripiego su scheda');
agg('--tinta', '--fondo', 4.5, 'tinta di ripiego sul fondo pagina');
agg('--tinta', '--velo', 4.5, 'tinta di ripiego sul proprio velo');
agg('--filetto', '--superficie', 3, 'filetto di ripiego su scheda');
agg('--filetto', '--fondo', 3, 'filetto di ripiego sul fondo pagina');

// stati e allarme
agg('--stato-testo', '--stato-fondo', 4.5, 'pillola di stato');
agg('--stato-bordo', '--superficie', 3, 'bordo della pillola di stato');
agg('--attenzione-testo', '--attenzione-fondo', 4.5, 'avviso su fondo d’attenzione');
agg('--attenzione-testo', '--fondo', 4.5, 'nota di progetto sul fondo pagina');
agg('--attenzione-testo', '--superficie', 4.5, 'nota di progetto su scheda');
agg('--allarme-testo', '--allarme-fondo', 4.5, 'blocco sicurezza');
agg('--allarme-testo', '--superficie', 4.5, 'titolo del blocco sicurezza');

// controlli
agg('--bordo-controllo', '--superficie', 3, 'bordo dei campi su scheda');
agg('--bordo-controllo', '--fondo', 3, 'bordo dei campi sul fondo pagina');
agg('--bordo-opzione', '--superficie', 3, 'bordo delle opzioni su scheda');
agg('--bordo-opzione', '--fondo', 3, 'bordo delle opzioni sul fondo pagina');
agg('--primario', '--superficie', 3, 'contorno di fuoco su scheda');
agg('--primario', '--fondo', 3, 'contorno di fuoco sul fondo pagina');

// azione primaria e riquadri tenui
agg('--superficie', '--primario', 4.5, 'testo dell’azione primaria');
agg('--primario', '--primario-chiaro', 4.5, 'testo primario su fondo tenue');
agg('--primario-scuro', '--primario-chiaro', 4.5, 'testo forte su fondo tenue');

// LE FASCE SCURE — è qui che il controllo precedente falliva.
// Questi token non si invertono fra i temi, per costruzione.
agg('--su-scuro', '--fondo-scuro', 4.5, 'testo sulla fascia scura');
agg('--su-scuro-forte', '--fondo-scuro', 4.5, 'titolo sulla fascia scura');
agg('--su-scuro-tenue', '--fondo-scuro', 4.5, 'occhiello sulla fascia scura');
agg('--fondo-scuro', '--su-scuro-forte', 4.5, 'azione chiara sulla fascia scura');
agg('--focus-su-scuro', '--fondo-scuro', 3, 'contorno di fuoco sulla fascia scura');

agg('--su-piede', '--piede-fondo', 4.5, 'testo del piè di pagina');
agg('--su-scuro', '--piede-fondo', 4.5, 'collegamenti del piè di pagina');
agg('--su-piede-tenue', '--piede-fondo', 4.5, 'titoletti del piè di pagina');
agg('--su-piede-recapiti', '--piede-fondo', 4.5, 'recapiti del piè di pagina');
agg('--su-scuro-forte', '--piede-fondo', 4.5, 'nome nel piè di pagina');
agg('--focus-su-scuro', '--piede-fondo', 3, 'contorno di fuoco nel piè di pagina');
agg('--bordo-su-scuro', '--piede-fondo', 1.2, 'divisore del piè di pagina');

let errori = 0;
let controlli = 0;

for (const [tema, token] of [['chiaro', CHIARO], ['scuro', SCURO]]) {
  for (const [a, b, soglia, cosa] of COPPIE) {
    const ca = token[a], cb = token[b];
    if (!ca || !cb) {
      console.error(`  ✗ [${tema}] token mancante: ${!ca ? a : b} (${cosa})`);
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

if (errori) {
  console.error(`\n✗ Contrasto: ${errori} coppie sotto soglia su ${controlli} verificate.`);
  process.exit(1);
}
console.log(`✓ Contrasto: ${controlli} coppie verificate nei due temi, tutte a norma.`);
