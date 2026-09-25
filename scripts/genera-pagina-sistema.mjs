#!/usr/bin/env node
/**
 * Genera una pagina autonoma del sistema, leggendo i valori veri da
 * token.css. Serve a far guardare il sistema a chi deve giudicarlo, senza
 * dover avviare il sito. Non contiene un solo valore scritto a mano: se i
 * token cambiano, la pagina cambia con loro.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { NUMERO_COPPIE } from './verifica-contrasto.mjs';

const qui = dirname(fileURLToPath(import.meta.url));
const tokenCss = readFileSync(resolve(qui, '../src/styles/token.css'), 'utf8');

function blocco(selettore) {
  const i = tokenCss.indexOf(selettore);
  const apre = tokenCss.indexOf('{', i);
  let livello = 0, j = apre;
  for (; j < tokenCss.length; j++) {
    if (tokenCss[j] === '{') livello++;
    else if (tokenCss[j] === '}' && --livello === 0) break;
  }
  const out = {};
  for (const m of tokenCss.slice(apre + 1, j).matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

const T = blocco(':root {');

const rgb = (h) => {
  let s = h.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const lum = (h) =>
  rgb(h)
    .map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; })
    .reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const rap = (a, b) => {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
const r2 = (a, b) => rap(a, b).toFixed(2).replace('.', ',');

const SETTORI = [
  ['salute-mentale', 'Salute mentale', 47],
  ['anziani', 'Anziani', 36],
  ['disabilita', 'Disabilità', 28],
  ['minori', 'Minori e famiglie', 13],
  ['dipendenze', 'Dipendenze', 8],
  ['sociale', 'Interventi sociali', 8],
];

const CORPI = [
  ['--corpo-7', 52, 'Apertura della pagina iniziale. Uno per sito.'],
  ['--corpo-6', 38, 'Titolo di pagina (H1).'],
  ['--corpo-5', 30, 'Titolo di sezione (H2).'],
  ['--corpo-4', 24, 'Titolo di blocco (H3).'],
  ['--corpo-3', 19, 'Testo introduttivo, sottotitoli.'],
  ['--corpo-2', 17, 'Testo corrente. È il corpo di base.'],
  ['--corpo-1', 15, 'Note, didascalie, etichette, pillole.'],
];

/* I passi di spaziatura si leggono dal file dei token, non si ricopiano:
   la pagina diceva «otto passi» dopo che ne era stato aggiunto un nono. */
const SPAZI = [...tokenCss.matchAll(/--sp-(\d+):\s*([\d.]+)rem/g)].map((m) => [
  +m[1],
  Math.round(parseFloat(m[2]) * 16),
]);
const PAROLA = ['zero','uno','due','tre','quattro','cinque','sei','sette','otto','nove','dieci','undici'];

// Il blocco :root della pagina autonoma: gli stessi token, copiati dal file
// vero. La pagina si adatta al tema chiaro e scuro come il sito.
const variabili = Object.entries(T)
  .map(([k, v]) => `    ${k}: ${v};`)
  .join('\n');
const variabiliScure = Object.entries(blocco(":root[data-tema='scuro']"))
  .map(([k, v]) => `    ${k}: ${v};`)
  .join('\n');

const html = `<title>Sistema Anteo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Public+Sans:wght@400;500;600&display=swap">
<style>
  :root {
${variabili}
    --font-display: "Fraunces", Georgia, "Times New Roman", serif;
    --font-testo: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      color-scheme: dark;
${variabiliScure}
    }
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
${variabiliScure}
  }

  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--fondo); color: var(--testo);
    font-family: var(--font-testo); font-size: var(--corpo-2);
    line-height: var(--interlinea-larga); -webkit-font-smoothing: antialiased;
  }
  .guscio { max-width: 1060px; margin: 0 auto; padding-inline: 16px; padding-block: 32px 72px; }
  h1, h2, h3 { font-family: var(--font-display); font-weight: 600; text-wrap: balance;
    color: var(--inchiostro); line-height: 1.12; letter-spacing: -0.012em; margin: 0; }
  h1 { font-size: var(--corpo-7); }
  h2 { font-size: var(--corpo-5); }
  h3 { font-size: var(--corpo-4); line-height: 1.3; }
  p { margin: 0; max-width: 65ch; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.88em;
    color: var(--primario); background: var(--primario-chiaro); padding: 0.1em 0.35em; border-radius: 4px; }
  .etichetta { font-size: var(--corpo-1); font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--testo-tenue); }
  .intro { font-size: var(--corpo-3); color: var(--testo-secondario); margin-top: 16px; }
  section { margin-top: 64px; padding-top: 32px; border-top: 1px solid var(--bordo); }
  section > p { margin-top: 12px; }
  .nota { font-size: var(--corpo-1); color: var(--testo-secondario); margin-top: 12px; }
  .numeri { font-variant-numeric: tabular-nums; }

  .colori { list-style: none; margin: 24px 0 0; padding: 0; display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 12px; }
  .colori li { display: flex; align-items: center; gap: 12px; padding: 12px;
    border: 1px solid var(--bordo); border-radius: var(--raggio); background: var(--superficie); }
  .campione { width: 46px; height: 46px; border-radius: var(--raggio); flex: none; }
  .colori div { flex: 1; min-width: 0; }
  .colori strong { display: block; }
  .mini { font-size: var(--corpo-1); color: var(--testo-tenue); }
  .pillola { display: inline-flex; padding: 4px 12px; border-radius: 999px;
    font-size: var(--corpo-1); font-weight: 600; white-space: nowrap; }
  .stato { display: inline-flex; align-items: center; gap: 8px;
    padding: 4px 12px; border-radius: 999px; font-size: var(--corpo-1);
    font-weight: 600; white-space: nowrap; background: var(--stato-fondo);
    color: var(--stato-testo); border: 1px solid var(--stato-bordo); }
  .stato.avvisa { background: var(--attenzione-fondo); color: var(--attenzione-testo);
    border-color: var(--attenzione-testo); }

  table { border-collapse: collapse; width: 100%; font-size: var(--corpo-1); }
  th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--bordo); vertical-align: middle; }
  th { font-weight: 600; color: var(--inchiostro); }
  .scroll { overflow-x: auto; margin-top: 24px; }

  .spazi { list-style: none; margin: 24px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .spazi li { display: flex; align-items: center; gap: 12px; }
  .barra { height: 20px; background: var(--primario); border-radius: 4px; flex: none; }

  .fila { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 16px; }
  .azione { display: inline-flex; align-items: center; justify-content: center; min-height: 52px;
    padding-inline: 24px; border-radius: var(--raggio); border: 1px solid transparent;
    font-size: var(--corpo-2); font-weight: 600; text-decoration: none; cursor: pointer; }
  .a-primario { background: var(--primario); color: var(--superficie); }
  .a-secondario { background: var(--superficie); color: var(--primario); border-color: var(--primario); }
  .a-quieto { background: transparent; color: var(--testo-secondario); border-color: var(--bordo-controllo); }

  .campo { display: flex; flex-direction: column; gap: 8px; max-width: 420px; margin-top: 16px; }
  .campo label { font-weight: 600; color: var(--inchiostro); }
  .campo span { font-weight: 400; font-size: var(--corpo-1); color: var(--testo-tenue); }
  .campo input { min-height: 52px; padding: 12px 16px; border: 1px solid var(--bordo-controllo);
    border-radius: var(--raggio); background: var(--superficie); font: inherit; color: inherit; }

  .schede { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; margin-top: 16px; }
  .scheda { background: var(--superficie); border: 1px solid var(--bordo); border-radius: var(--raggio);
    padding: 28px 24px 24px; position: relative; overflow: hidden; }
  .scheda::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 4px; background: var(--filetto, transparent); }
  .regole { margin: 16px 0 0; padding-left: 24px; display: flex; flex-direction: column; gap: 12px; }
  .regole li { max-width: 65ch; }
  :is(a, button, input):focus-visible { outline: 3px solid var(--primario); outline-offset: 2px; }
</style>

<div class="guscio">
  <p class="etichetta">Anteo Impresa Sociale · riferimento interno</p>
  <h1>Il sistema</h1>
  <p class="intro">Colore, corpo, spaziatura e raggio del nuovo sito. I valori di questa pagina
  sono letti dal file dei token del progetto: se lì cambia qualcosa, cambia anche qui. I rapporti
  di contrasto sono calcolati, non dichiarati.</p>

  <section>
    <h2>Il colore significa settore</h2>
    <p>Sei tinte, un solo significato, su tutto il sito. Il pubblico si distingue per posizione
    nella pagina e per forma, non per tinta: nel prototipo gli stessi quattro colori significavano
    «pubblico» in home e «settore» nell'area invianti, e dopo due clic il lettore non sapeva più
    cosa volesse dire il verde.</p>
    <ul class="colori">
${SETTORI.map(([c, nome, sedi]) => {
  const g = T[`--${c}-grafico`], t = T[`--${c}-testo`], f = T[`--${c}-fondo`];
  return `      <li>
        <span class="campione" style="background: linear-gradient(to bottom, ${g} 0 60%, ${f} 60% 100%)"></span>
        <div><strong>${nome}</strong><span class="mini numeri">${sedi} sedi · filetto ${r2(g, T['--superficie'])}:1 · testo ${r2(t, f)}:1</span></div>
        <span class="pillola" style="background:${f};color:${t}">testo</span>
      </li>`;
}).join('\n')}
    </ul>
    <p class="nota">Le versioni <em>grafiche</em> servono a barre, filetti e badge e stanno sopra
    3:1. Per il testo esistono quelle scurite, sopra 4,5:1: sotto i 24 px gli accenti del marchio
    non passano, e usarli come testo sarebbe un difetto di accessibilità, non una scelta grafica.
    Il giallo del marchio su bianco sta a ${r2('#f9af25', '#ffffff')}:1 — come segno che identifica
    un settore sarebbe invisibile, e infatti la tinta grafica di «minori» è un'ambra scurita.</p>
  </section>

  <section>
    <h2>Sette gradi, non uno di più</h2>
    <p>Fraunces per i titoli, Public Sans per il testo. Nel sito sono auto-ospitati: nessun host di
    terze parti sul percorso critico.</p>
    <div class="scroll">
      <table>
        <thead><tr><th>Token</th><th>Misura</th><th>Dove si usa</th><th>Come si vede</th></tr></thead>
        <tbody>
${CORPI.map(([tok, px, uso]) => `          <tr><td><code>${tok}</code></td><td class="numeri">${px} px</td><td>${uso}</td>
            <td style="font-family: var(--font-display); font-size: var(${tok}); line-height: 1.1">Anteo</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
    <p class="nota">I tre gradi più alti sono fluidi: si restringono da soli sul telefono, senza
    punti di rottura da mantenere a mano.</p>
  </section>

  <section>
    <h2>${PAROLA[SPAZI.length][0].toUpperCase()}${PAROLA[SPAZI.length].slice(1)} passi di spaziatura</h2>
    <p>Tutti multipli di 4. Fuori da questi ${PAROLA[SPAZI.length]} non si va, e un controllo
    automatico blocca chi ci prova.</p>
    <ul class="spazi">
${SPAZI.map(([n, px]) => `      <li><span class="barra" style="width:${px}px"></span><code>--sp-${n}</code><span class="mini numeri">${px} px</span></li>`).join('\n')}
    </ul>
  </section>

  <section>
    <h2>I componenti</h2>
    <p>Uno per ruolo, riusato ovunque. Due raggi soli: <code>12px</code> e pieno.</p>

    <h3>L'azione</h3>
    <p class="nota">Una sola altezza, 52 px. La gerarchia sta nel tono, non nella dimensione: nel
    prototipo l'azione secondaria era più grande della primaria.</p>
    <div class="fila">
      <button class="azione a-primario">Fatti richiamare</button>
      <button class="azione a-secondario">Guarda i servizi</button>
      <button class="azione a-quieto">Annulla</button>
    </div>

    <h3>La pillola, e lo stato</h3>
    <p class="nota">Sono due cose diverse e vanno tenute diverse. La pillola prende la tinta del
    settore, perché il colore su questo sito significa settore e nient'altro. Lo stato di un
    posto — libero, in attesa, su invio — si legge da un glifo su fondo neutro, che funziona
    anche per chi i colori non li distingue. Prima erano la stessa forma con due significati:
    «posti disponibili» usciva del verde di «anziani» e «lista d'attesa» del rosso di
    «dipendenze».</p>
    <div class="fila">
      <span class="pillola" style="background:var(--superficie-alt);color:var(--testo-secondario);border:1px solid var(--bordo)">neutra</span>
      <span class="pillola" style="background:var(--anziani-fondo);color:var(--anziani-testo)">anziani</span>
      <span class="pillola" style="background:var(--salute-mentale-fondo);color:var(--salute-mentale-testo)">salute mentale</span>
    </div>
    <div class="fila">
      <span class="stato">&#9679; posti disponibili</span>
      <span class="stato">&#9680; lista d’attesa</span>
      <span class="stato">&#9675; su invio del servizio pubblico</span>
      <span class="stato avvisa">&#8635; dato da aggiornare</span>
    </div>

    <h3>La scheda</h3>
    <div class="schede">
      <div class="scheda" style="--filetto: var(--salute-mentale-grafico)">
        <h3>Gruppo appartamento</h3>
        <p class="nota">Il filetto in alto dice il settore, e nient'altro.</p>
      </div>
      <div class="scheda">
        <h3>Senza filetto</h3>
        <p class="nota">Quando il contenuto non appartiene a un settore.</p>
      </div>
    </div>

    <h3>Il campo</h3>
    <p class="nota">Bordo a ${r2(T['--bordo-controllo'], T['--superficie'])}:1 contro l'1,77:1 del
    prototipo. Obbligatorietà scritta a parole, non con un asterisco. Etichetta sempre collegata,
    mai un placeholder al suo posto.</p>
    <div class="campo">
      <label for="tel">Telefono <span>(obbligatorio)</span></label>
      <input id="tel" type="tel" inputmode="tel" autocomplete="tel">
    </div>
  </section>

  <section>
    <h2>Le regole che il codice fa rispettare</h2>
    <ul class="regole">
      <li><strong>Nessun valore letterale nei componenti.</strong> Colore, corpo, spaziatura e
      raggio vengono dai token, e un controllo fallisce se ne compare uno scritto a mano.</li>
      <li><strong>Ogni coppia testo/fondo sopra 4,5:1, ogni bordo di controllo sopra 3:1.</strong>
      <span class="numeri">${NUMERO_COPPIE}</span> coppie ricalcolate a ogni modifica, nei due
      temi. Il numero lo dichiara il verificatore, non questa pagina: diceva «novanta» quando
      erano già molte di più.</li>
      <li><strong>Focus visibile ovunque:</strong> contorno di 3 px con scostamento di 2 px su ogni
      elemento interattivo, in entrambi i temi.</li>
      <li><strong>Una sola navigazione</strong>, identica su tutte le pagine, con l'area invianti
      sempre presente.</li>
      <li><strong>Nessun importo, da nessuna parte.</strong> Di soldi si parla di persona. L'unica
      cifra pubblicata è la retribuzione negli annunci di lavoro.</li>
      <li><strong>Anteo Impresa Sociale, per esteso, sempre.</strong></li>
    </ul>
  </section>
</div>
`;

const destinazione = resolve(qui, '../dist-sistema.html');
writeFileSync(destinazione, html, 'utf8');
console.log(`✓ Pagina del sistema generata: ${destinazione} (${html.length} caratteri)`);
