#!/usr/bin/env node
/**
 * Anteprima statica della scheda RSA Gran Torino.
 *
 * Serve a guardare la pagina senza avviare il progetto. La pagina VERA è
 * `src/pages/servizi/anziani/torino/rsa-gran-torino.astro`, costruita con i
 * componenti; questa la ricompone in un file unico. Il contenuto viene dallo
 * stesso file (`src/content/rsa-gran-torino.js`) e i colori dallo stesso
 * `token.css`: se cambiano lì, cambiano anche qui. Si ripete soltanto il
 * markup, perché senza Astro i componenti non si possono montare.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { scheda as s } from '../src/content/rsa-gran-torino.js';

const qui = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(qui, '../src/styles/token.css'), 'utf8');

function blocco(selettore) {
  const i = css.indexOf(selettore);
  const apre = css.indexOf('{', i);
  let livello = 0, j = apre;
  for (; j < css.length; j++) {
    if (css[j] === '{') livello++;
    else if (css[j] === '}' && --livello === 0) break;
  }
  return Object.fromEntries(
    [...css.slice(apre + 1, j).matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
  );
}

const vars = (o) => Object.entries(o).map(([k, v]) => `    ${k}: ${v};`).join('\n');
const chiaro = vars(blocco(':root {'));
const scuro = vars(blocco(":root[data-tema='scuro']"));
const e = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CAMBIAMENTI = [
  [
    'Il link alla carta dei servizi non c’è più',
    'Conteneva la retta. La regola sui prezzi vale sempre, quindi la carta si consegna al colloquio o su richiesta. Nel prototipo il sito rifiutava il numero e dodici centimetri più sotto lo linkava.',
  ],
  [
    'Il blocco sui costi dice chi paga cosa',
    'Senza dire quanto. Quota sanitaria all’ASL, quota alberghiera alla famiglia, detrazioni e contributi regionali, e la cifra scritta voce per voce entro 48 ore dalla visita. È sparita la frase «contributi che quasi nessuno conosce per intero», che suonava condiscendente verso chi legge.',
  ],
  [
    'L’indirizzo web è vero',
    '/servizi/anziani/torino/rsa-gran-torino. Nel prototipo il percorso di navigazione mostrava quattro livelli che puntavano tutti alla stessa pagina: la gerarchia era disegnata, non esisteva. Senza quella non esistono le pagine di settore e di provincia, che sono l’unico modo per intercettare chi cerca «RSA Torino».',
  ],
  [
    'Un solo corpo tipografico per ruolo',
    'La pagina usa cinque dei sette gradi. Nel prototipo l’H1 aveva cinque corpi diversi e l’H2 nove, a seconda della schermata.',
  ],
  [
    'Una sola azione primaria, alta 52 px',
    'Nel prototipo la CTA aveva sei altezze e in una schermata l’azione secondaria era più grande della primaria.',
  ],
  [
    'Il colore significa solo settore',
    'Il verde qui è «anziani» e nient’altro, dalla pillola in alto al filetto del paragrafo «per chi no» all’ora della giornata tipo. Nel prototipo gli stessi colori significavano «pubblico» in home e «settore» nell’area invianti.',
  ],
  [
    'Dati strutturati ResidentialCare',
    'Marcati in pagina, con l’indirizzo dentro la marcatura solo se la sede è pubblicabile. Nel prototipo nessuna delle otto schermate aveva marcatura schema.org.',
  ],
  [
    'Nome e foto del direttore dietro due consensi',
    'Distinti: uno per il nome, uno per la fotografia. Se mancano, il gestionale non restituisce il campo — non lo restituisce vuoto.',
  ],
];

const html = `<title>Scheda RSA Gran Torino</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Public+Sans:wght@400;500;600&display=swap">
<style>
  :root {
${chiaro}
    --font-display: "Fraunces", Georgia, serif;
    --font-testo: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { color-scheme: dark;
${scuro}
  } }
  :root[data-theme="dark"] { color-scheme: dark;
${scuro}
  }

  * { box-sizing: border-box; }
  body { margin: 0; background: var(--fondo); color: var(--testo);
    font-family: var(--font-testo); font-size: var(--corpo-2); line-height: var(--interlinea-larga);
    -webkit-font-smoothing: antialiased; }
  .guscio { max-width: 1100px; margin: 0 auto; padding-inline: 16px; }
  h1, h2, h3 { font-family: var(--font-display); font-weight: 600; color: var(--inchiostro);
    line-height: 1.12; letter-spacing: -0.012em; margin: 0; text-wrap: balance; }
  h1 { font-size: var(--corpo-6); }
  h2 { font-size: var(--corpo-5); }
  h3 { font-size: var(--corpo-3); line-height: 1.3; }
  p { margin: 0; max-width: 65ch; }
  a { color: var(--primario); text-underline-offset: 0.18em; }
  .etichetta { font-size: var(--corpo-1); font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--testo-tenue); }
  .numeri { font-variant-numeric: tabular-nums; }

  .barra-finta { background: var(--superficie); border-bottom: 1px solid var(--bordo);
    padding-block: 12px; font-size: var(--corpo-1); color: var(--testo-tenue); }
  .barra-finta .guscio { display: flex; gap: 24px; flex-wrap: wrap; align-items: center; }
  .barra-finta strong { font-family: var(--font-display); font-size: var(--corpo-3);
    color: var(--primario); }
  .barra-finta span[aria-current] { color: var(--primario); font-weight: 600; }

  .briciole { padding-top: 16px; font-size: var(--corpo-1); color: var(--testo-tenue); }
  .briciole span + span::before { content: "› "; color: var(--bordo-controllo); }

  .apertura { padding-top: 24px; }
  .riga-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
  .pillola { display: inline-flex; padding: 4px 12px; border-radius: 999px; font-size: var(--corpo-1);
    font-weight: 600; background: var(--anziani-fondo); color: var(--anziani-testo); }
  .disponibilita { font-size: var(--corpo-1); color: var(--testo-secondario); font-weight: 600; }
  .disponibilita em { font-style: normal; font-weight: 400; color: var(--testo-tenue); }
  .apertura h1 { margin-top: 12px; }
  .dati { margin-top: 12px; color: var(--testo-secondario); max-width: none; }

  .segnaposto { margin-top: 24px; background: var(--superficie-alt);
    border: 1px dashed var(--bordo-controllo); border-radius: var(--raggio); aspect-ratio: 21/9;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; text-align: center; padding: 24px; }
  .segnaposto p { color: var(--testo-tenue); }
  figcaption { font-size: var(--corpo-1); color: var(--testo-tenue); margin-top: 12px; max-width: 65ch; }

  .impaginato { display: grid; grid-template-columns: minmax(0,1fr) 330px; gap: 48px;
    align-items: start; margin-top: 48px; }
  section + section { margin-top: 48px; }
  section h2 { margin-bottom: 16px; }
  section p + p { margin-top: 12px; }
  .non-e { border-left: 3px solid var(--anziani-grafico); padding-left: 16px; color: var(--testo-secondario); }

  .giornata { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
  .giornata li { display: grid; grid-template-columns: 4.5rem minmax(0,1fr); gap: 16px;
    padding-bottom: 12px; border-bottom: 1px solid var(--bordo); }
  .ora { font-family: var(--font-display); font-weight: 600; color: var(--anziani-testo); }

  .costi { background: var(--primario-chiaro); border: 1px solid var(--primario-bordo);
    border-radius: var(--raggio); padding: 32px; }
  .voci { list-style: none; margin: 16px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .voci li { background: var(--superficie); border: 1px solid var(--primario-bordo);
    border-radius: 999px; padding: 4px 12px; font-size: var(--corpo-1); font-weight: 500;
    color: var(--primario-scuro); }

  .passi { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
  .passi li { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 16px; align-items: start; }
  .numero { width: 44px; height: 44px; border-radius: 999px; background: var(--primario-chiaro);
    color: var(--primario); font-family: var(--font-display); font-size: var(--corpo-3);
    font-weight: 600; display: grid; place-items: center; }
  .passi p { color: var(--testo-secondario); margin-top: 4px; }

  .referente { display: flex; gap: 16px; align-items: center; background: var(--superficie);
    border: 1px solid var(--bordo); border-radius: var(--raggio); padding: 16px; }
  .ritratto { width: 76px; height: 76px; border-radius: 999px; background: var(--superficie-alt);
    border: 1px dashed var(--bordo-controllo); display: grid; place-items: center;
    font-size: var(--corpo-1); color: var(--testo-tenue); flex: none; }
  .nome { font-family: var(--font-display); font-size: var(--corpo-4); font-weight: 600;
    color: var(--inchiostro); }
  .ruolo { font-size: var(--corpo-1); color: var(--testo-tenue); }

  .atti { margin: 0; display: grid; grid-template-columns: auto minmax(0,1fr); gap: 8px 16px;
    font-size: var(--corpo-1); }
  .atti dt { font-weight: 600; color: var(--inchiostro); }
  .atti dd { margin: 0; color: var(--testo-secondario); }
  .nota { font-size: var(--corpo-1); color: var(--testo-secondario); margin-top: 16px; }

  .lato { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 16px; }
  .riquadro { background: var(--primario-chiaro); border: 1px solid var(--primario-bordo);
    border-radius: var(--raggio); padding: 24px; display: flex; flex-direction: column; gap: 12px; }
  .riquadro.quieto { background: var(--superficie); border-color: var(--bordo); }
  .riquadro h2 { font-size: var(--corpo-4); }
  .riquadro p { font-size: var(--corpo-1); color: var(--testo-secondario); }
  .indirizzo { font-weight: 600; color: var(--inchiostro) !important; }
  .arrivare { margin: 0; padding-left: 24px; font-size: var(--corpo-1); color: var(--testo-secondario); }
  .azione { display: inline-flex; align-items: center; justify-content: center; min-height: 52px;
    padding-inline: 24px; border-radius: var(--raggio); border: 1px solid transparent;
    font-size: var(--corpo-2); font-weight: 600; text-decoration: none; width: 100%; }
  .a-primario { background: var(--primario); color: var(--superficie); }
  .a-secondario { background: var(--superficie); color: var(--primario); border-color: var(--primario); }

  .piede-finto { background: var(--primario-scuro); color: var(--primario-chiaro);
    margin-top: 64px; padding-block: 32px; font-size: var(--corpo-1); }

  .confronto { margin-top: 64px; padding-top: 32px; border-top: 1px solid var(--bordo); }
  .confronto ol { margin: 24px 0 0; padding: 0; list-style: none; display: flex;
    flex-direction: column; gap: 16px; counter-reset: c; }
  .confronto li { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 16px; align-items: start; }
  .confronto li::before { counter-increment: c; content: counter(c); width: 32px; height: 32px;
    border-radius: 999px; background: var(--superficie-alt); border: 1px solid var(--bordo);
    color: var(--testo-secondario); font-size: var(--corpo-1); font-weight: 600;
    display: grid; place-items: center; font-variant-numeric: tabular-nums; }
  .confronto h3 { margin-bottom: 4px; }
  .confronto p { color: var(--testo-secondario); font-size: var(--corpo-1); }

  @media (max-width: 62rem) {
    .impaginato { grid-template-columns: 1fr; gap: 32px; margin-top: 32px; }
    .lato { position: static; }
  }
</style>

<div class="barra-finta">
  <div class="guscio">
    <strong>Anteo Impresa Sociale</strong>
    <span>Trova un servizio</span>
    <span>Per i servizi invianti</span>
    <span>Lavora con noi</span>
    <span>Chi siamo</span>
    <span>Enti e gare</span>
  </div>
</div>

<div class="guscio briciole">
  ${s.percorso.map((v, i) => `<span${i === s.percorso.length - 1 ? ' aria-current="page"' : ''}>${e(v)}</span>`).join(' ')}
</div>

<header class="guscio apertura">
  <div class="riga-meta">
    <span class="pillola">${e(s.tipologia)}</span>
    <span class="disponibilita">${e(s.disponibilita.testoSegnaposto)}
      <em>· dal gestionale, con la data di aggiornamento</em></span>
  </div>
  <h1>${e(s.nome)}</h1>
  <p class="dati numeri">${e(s.indirizzo)} · <strong>${s.postiLetto}</strong> posti letto · aperta nel ${e(s.apertaNel)}</p>
</header>

<div class="guscio">
  <figure class="segnaposto-wrap" style="margin:0">
    <div class="segnaposto">
      <p class="etichetta">${e(s.galleria.segnaposto)}</p>
      <p>${e(s.galleria.didascalia)}</p>
    </div>
    <figcaption>${e(s.galleria.nota)}</figcaption>
  </figure>
</div>

<div class="guscio impaginato">
  <div>
    <section>
      <h2>${e(s.perChi.titolo)}</h2>
      <p>${e(s.perChi.si)}</p>
      <p class="non-e">${e(s.perChi.no)}</p>
    </section>

    <section>
      <h2>Una giornata qui</h2>
      <ol class="giornata">
${s.giornata.map(([o, c]) => `        <li><span class="ora numeri">${e(o)}</span><span>${e(c)}</span></li>`).join('\n')}
      </ol>
    </section>

    <section class="costi">
      <h2>${e(s.costi.titolo)}</h2>
${s.costi.testo.map((t) => `      <p>${e(t)}</p>`).join('\n')}
      <ul class="voci">
${s.costi.voci.map((v) => `        <li>${e(v)}</li>`).join('\n')}
      </ul>
    </section>

    <section>
      <h2>Come si entra</h2>
      <ol class="passi">
${s.ingresso.map(([t, d]) => `        <li><span class="numero" aria-hidden="true"></span><div><h3>${e(t)}</h3><p>${e(d)}</p></div></li>`).join('\n')}
      </ol>
      <p class="nota"><a href="#">Documenti da portare: l’elenco completo</a></p>
    </section>

    <section>
      <h2>Chi risponde, qui dentro</h2>
      <div class="referente">
        <div class="ritratto" aria-hidden="true">[FOTO]</div>
        <div>
          <p class="nome">${e(s.direttore.nome)}</p>
          <p class="ruolo">${e(s.direttore.ruolo)} · qui dal ${e(s.direttore.dal)}</p>
          <p>${e(s.direttore.nota)}</p>
        </div>
      </div>
      <p class="nota">Nome e fotografia compaiono solo con due consensi distinti, e il gestionale
      non li restituisce se mancano: il campo non arriva vuoto, non arriva.</p>
    </section>

    <section>
      <h2>Autorizzazione e qualità</h2>
      <dl class="atti">
${s.autorizzazioni.map(([v, x]) => `        <dt>${e(v)}</dt><dd>${e(x)}</dd>`).join('\n')}
      </dl>
      <p class="nota">${e(s.cartaDeiServizi)}</p>
      <p class="nota"><a href="#">Reclami e segnalazioni: come si presentano</a></p>
    </section>
  </div>

  <aside class="lato">
    <div class="riquadro">
      <h2>${e(s.visita.titolo)}</h2>
      <p>${e(s.visita.testo)}</p>
      <a class="azione a-primario" href="#">Prenota una visita</a>
      <a class="azione a-secondario" href="#">Fatti richiamare</a>
    </div>
    <div class="riquadro quieto">
      <h2>Dove si trova</h2>
      <p class="indirizzo">${e(s.indirizzo)}</p>
      <ul class="arrivare">
${s.comeArrivare.map((r) => `        <li>${e(r)}</li>`).join('\n')}
      </ul>
    </div>
    <div class="riquadro quieto">
      <h2>Lavori nel settore?</h2>
      <p>${e(s.lavoro)}</p>
      <p><a href="#">Vedi le posizioni qui →</a></p>
    </div>
  </aside>
</div>

<div class="piede-finto">
  <div class="guscio">Anteo Impresa Sociale · cooperativa sociale · Biella</div>
</div>

<div class="guscio confronto">
  <p class="etichetta">Nota per chi guarda</p>
  <h2>Rispetto al prototipo</h2>
  <p>Il contenuto è lo stesso, riscritto dove le tre revisioni avevano trovato qualcosa. Otto
  differenze, tutte conseguenze di decisioni già prese.</p>
  <ol>
${CAMBIAMENTI.map(([t, d]) => `    <li><div><h3>${e(t)}</h3><p>${e(d)}</p></div></li>`).join('\n')}
  </ol>
</div>
`;

const dove = resolve(qui, '../dist-scheda.html');
writeFileSync(dove, html, 'utf8');
console.log(`✓ Anteprima generata: ${dove} (${html.length} caratteri)`);
