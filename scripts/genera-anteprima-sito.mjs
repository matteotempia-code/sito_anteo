#!/usr/bin/env node
/**
 * Anteprima navigabile del nuovo sito: sei schermate in un file solo.
 *
 * Serve a giudicare il sistema su più pagine, che è l'unico modo serio di
 * giudicarlo. I colori vengono da `token.css` e i contenuti dai file in
 * `src/content/`: se cambiano lì, cambiano qui. Si ripete soltanto il
 * markup, perché senza Astro i componenti non si montano.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { scheda as rsa } from '../src/content/rsa-gran-torino.js';
import { SETTORI, PORTE, SICUREZZA, RICERCA, GRUPPO, INVIANTI, ANNUNCIO } from '../src/content/schermate.js';

const qui = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(qui, '../src/styles/token.css'), 'utf8');

function blocco(sel) {
  const i = css.indexOf(sel);
  const apre = css.indexOf('{', i);
  let liv = 0, j = apre;
  for (; j < css.length; j++) {
    if (css[j] === '{') liv++;
    else if (css[j] === '}' && --liv === 0) break;
  }
  return Object.fromEntries(
    [...css.slice(apre + 1, j).matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
  );
}
const vars = (o) => Object.entries(o).map(([k, v]) => `    ${k}: ${v};`).join('\n');
const chiaro = vars(blocco(':root {'));
const scuro = vars(blocco(":root[data-tema='scuro']"));
const e = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Il marchio vero, dal vettoriale, incorporato nella pagina: l'anteprima è
   un file solo e non può andare a prendere un file accanto. */
const marchio = (file) =>
  'data:image/svg+xml;base64,' +
  readFileSync(resolve(qui, `../public/marchio/${file}`)).toString('base64');
const LOGO = marchio('logo-lockup.svg');
const LOGO_BIANCO = marchio('logo-lockup-bianco.svg');

/* ------------------------------------------------------------------ pezzi */
const nav = (attiva) => `
  <header class="sito-testata">
    <div class="guscio riga-testata">
      <img class="marchio" src="${LOGO}" alt="Anteo Impresa Sociale" width="318" height="305">
      <nav aria-label="Navigazione principale">
        ${['Trova un servizio', 'Per i servizi invianti', 'Lavora con noi', 'Chi siamo', 'Enti e gare']
          .map((v) => `<span${v === attiva ? ' class="attiva" aria-current="page"' : ''}>${v}</span>`)
          .join('')}
      </nav>
    </div>
  </header>`;

const briciole = (voci) =>
  `<div class="guscio briciole">${voci.map((v, i) => `<span${i === voci.length - 1 ? ' aria-current="page"' : ''}>${e(v)}</span>`).join(' ')}</div>`;

const piede = `
  <footer class="sito-piede">
    <div class="guscio">
      <img class="marchio-bianco" src="${LOGO_BIANCO}" alt="Anteo Impresa Sociale" width="318" height="305">
      <p class="piede-riga"><strong>Anteo Impresa Sociale</strong> — società cooperativa sociale · Biella</p>
      <span class="piede-link">Informativa privacy · Dichiarazione di accessibilità · Contatti</span>
    </div>
  </footer>`;

const bloccoSicurezza = `
  <aside class="sicurezza" aria-label="Se sei in pericolo">
    <p class="sic-titolo">${e(SICUREZZA.titolo)}</p>
    <ul>
      ${SICUREZZA.righe.map(([n, d]) => `<li><strong class="numeri">${e(n)}</strong> ${e(d)}</li>`).join('')}
    </ul>
    <p class="sic-avviso">${e(SICUREZZA.avviso)}</p>
    <span class="sic-esci">${e(SICUREZZA.uscita)}</span>
  </aside>`;

/* ------------------------------------------------------------------ pagine */

const HOME = `
${nav('')}
<section class="guscio apertura-home">
  <p class="etichetta">Anteo Impresa Sociale</p>
  <h1 class="titolo-apertura">Di chi stiamo parlando, e che cosa succede?</h1>
  <p class="occhiello-testo">Da qui si parte dalla situazione, non dalla categoria autorizzativa.
  Se il servizio giusto non è nostro, te lo diciamo lo stesso.</p>
  <div class="porte">
    ${PORTE.map(([occ, tit, txt], i) => `
    <article class="porta p-${i + 1}">
      <p class="etichetta">${e(occ)}</p>
      <h2>${e(tit)}</h2>
      <p class="porta-testo">${e(txt)}</p>
      <span class="freccia" aria-hidden="true">→</span>
    </article>`).join('')}
  </div>
</section>

<section class="guscio sez">
  <h2>Sei settori, <span class="numeri">347</span> servizi</h2>
  <p class="sotto"><strong class="numeri">347 servizi</strong> è il dato ufficiale, dal gestionale.
  Le <strong class="numeri">140 sedi</strong> qui sotto sono i luoghi fisici: sono due grandezze
  diverse e le teniamo separate.</p>
  <ul class="griglia-settori">
    ${SETTORI.map(([cod, nome, sedi, desc, diretto]) => `
    <li class="scheda-settore s-${cod}">
      <div class="testa-settore">
        <h3>${e(nome)}</h3>
        <span class="pillola s-${cod}"><span class="numeri">${sedi}</span>&nbsp;sedi</span>
      </div>
      <p>${e(desc)}</p>
      ${diretto ? '' : '<p class="accesso">Si entra tramite il servizio pubblico inviante, non scrivendo a noi.</p>'}
    </li>`).join('')}
  </ul>
</section>

<section class="guscio sez">
  <div class="riquadro-costi">
    <div>
      <h2>Quanto costa</h2>
      <p>Non pubblichiamo un listino, perché sarebbe un numero falso: la quota sanitaria è a carico
      dell’ASL, la quota alberghiera della famiglia, ed esistono detrazioni e contributi regionali
      che cambiano da territorio a territorio.</p>
      <p>La cifra esatta arriva scritta, voce per voce, <strong>entro 48 ore dalla visita</strong> e
      prima di qualsiasi firma. Prima però parliamo della persona.</p>
    </div>
    <div class="azioni-colonna">
      <span class="azione a-primario">Fatti richiamare</span>
      <span class="azione a-secondario">Guarda i servizi</span>
    </div>
  </div>
</section>

<section class="guscio sez">
  <div class="riquadro-lavoro">
    <div>
      <p class="etichetta chiara">Lavora con noi</p>
      <h2 class="bianco">[N] posizioni aperte in [N] province</h2>
      <p>Retribuzione dichiarata in ogni annuncio, livello CCNL, indennità. Dopo tre anni si può
      diventare soci — con quello che comporta, spiegato prima.</p>
    </div>
    <span class="azione a-bianco">Vedi le posizioni</span>
  </div>
</section>
${piede}`;

const TROVA = `
${nav('Trova un servizio')}
${briciole(['Home', 'Trova un servizio'])}
<section class="guscio apertura">
  <h1>${e(RICERCA.titolo)}</h1>
  <p class="occhiello-testo">${e(RICERCA.intro)}</p>
  ${bloccoSicurezza}
  <form class="filtro" onsubmit="return false">
    ${RICERCA.passi.map((p) => `
    <fieldset>
      <legend>${e(p.legenda)}</legend>
      <div class="opzioni">
        ${p.opzioni.map((o) => `<span class="opzione">${e(o)}</span>`).join('')}
      </div>
    </fieldset>`).join('')}
    <span class="azione a-primario largo">${e(RICERCA.azione)}</span>
    <p class="nota">${e(RICERCA.nota)}</p>
  </form>
</section>

<section class="guscio sez">
  <h2>${e(RICERCA.esito)}</h2>
  <ul class="risultati">
    ${[['anziani', 'RSA Gran Torino', 'Residenza sanitaria per anziani · Torino', '[N] posti disponibili'],
       ['anziani', 'Casa di riposo [NOME]', 'Casa di riposo · [COMUNE]', 'Lista d’attesa'],
       ['salute-mentale', 'Centro diurno [NOME]', 'Centro diurno · [COMUNE]', 'Su invio del CSM']]
      .map(([cod, nome, tipo, stato]) => `
    <li class="risultato s-${cod}">
      <div>
        <h3>${e(nome)}</h3>
        <p>${e(tipo)}</p>
      </div>
      <span class="pillola ${stato.includes('posti') ? 'p-positivo' : stato.includes('attesa') ? 'p-critico' : 'p-neutro'}">${e(stato)}</span>
    </li>`).join('')}
  </ul>
  <p class="nota">Quando il servizio adatto non è nostro, l’elenco lo dice e indirizza altrove.
  Costa poco e vale moltissimo in credibilità.</p>
</section>
${piede}`;

const SCHEDA_RSA = `
${nav('Trova un servizio')}
${briciole(rsa.percorso)}
<header class="guscio apertura">
  <div class="riga-meta">
    <span class="pillola s-anziani">${e(rsa.tipologia)}</span>
    <span class="disponibilita">${e(rsa.disponibilita.testoSegnaposto)}
      <em>· dal gestionale, con la data di aggiornamento</em></span>
  </div>
  <h1>${e(rsa.nome)}</h1>
  <p class="dati numeri">${e(rsa.indirizzo)} · <strong>${rsa.postiLetto}</strong> posti letto · aperta nel ${e(rsa.apertaNel)}</p>
</header>
<div class="guscio">
  <figure style="margin:0">
    <div class="segnaposto">
      <p class="etichetta">${e(rsa.galleria.segnaposto)}</p>
      <p>${e(rsa.galleria.didascalia)}</p>
    </div>
    <figcaption>${e(rsa.galleria.nota)}</figcaption>
  </figure>
</div>
<div class="guscio impaginato">
  <div>
    <section><h2>${e(rsa.perChi.titolo)}</h2><p>${e(rsa.perChi.si)}</p>
      <p class="non-e s-anziani">${e(rsa.perChi.no)}</p></section>
    <section><h2>Una giornata qui</h2><ol class="giornata">
      ${rsa.giornata.map(([o, c]) => `<li><span class="ora s-anziani numeri">${e(o)}</span><span>${e(c)}</span></li>`).join('')}
    </ol></section>
    <section class="costi"><h2>${e(rsa.costi.titolo)}</h2>
      ${rsa.costi.testo.map((t) => `<p>${e(t)}</p>`).join('')}
      <ul class="voci">${rsa.costi.voci.map((v) => `<li>${e(v)}</li>`).join('')}</ul>
    </section>
    <section><h2>Come si entra</h2><ol class="passi">
      ${rsa.ingresso.map(([t, d]) => `<li><span class="numero" aria-hidden="true"></span><div><h3>${e(t)}</h3><p>${e(d)}</p></div></li>`).join('')}
    </ol><p class="nota"><a href="#">Documenti da portare: l’elenco completo</a></p></section>
    <section><h2>Chi risponde, qui dentro</h2>
      <div class="referente"><div class="ritratto" aria-hidden="true">[FOTO]</div>
      <div><p class="nome">${e(rsa.direttore.nome)}</p>
      <p class="ruolo">${e(rsa.direttore.ruolo)} · qui dal ${e(rsa.direttore.dal)}</p>
      <p>${e(rsa.direttore.nota)}</p></div></div>
      <p class="nota">Nome e fotografia compaiono solo con due consensi distinti, e il gestionale
      non li restituisce se mancano: il campo non arriva vuoto, non arriva.</p></section>
    <section><h2>Autorizzazione e qualità</h2><dl class="atti">
      ${rsa.autorizzazioni.map(([v, x]) => `<dt>${e(v)}</dt><dd>${e(x)}</dd>`).join('')}
    </dl><p class="nota">${e(rsa.cartaDeiServizi)}</p></section>
  </div>
  <aside class="lato">
    <div class="riquadro"><h2>${e(rsa.visita.titolo)}</h2><p>${e(rsa.visita.testo)}</p>
      <span class="azione a-primario largo">Prenota una visita</span>
      <span class="azione a-secondario largo">Fatti richiamare</span></div>
    <div class="riquadro quieto"><h2>Dove si trova</h2>
      <p class="indirizzo">${e(rsa.indirizzo)}</p>
      <ul class="arrivare">${rsa.comeArrivare.map((r) => `<li>${e(r)}</li>`).join('')}</ul></div>
    <div class="riquadro quieto"><h2>Lavori nel settore?</h2><p>${e(rsa.lavoro)}</p></div>
  </aside>
</div>
${piede}`;

const GRUPPO_APP = `
${nav('Trova un servizio')}
${briciole(['Home', 'Servizi', 'Salute mentale', 'Vercelli', GRUPPO.nome])}
<header class="guscio apertura">
  <div class="riga-meta">
    <span class="pillola s-salute-mentale">${e(GRUPPO.tipologia)}</span>
  </div>
  <h1>${e(GRUPPO.nome)}</h1>
  <p class="dati">${e(GRUPPO.dove)}</p>
</header>
<div class="guscio impaginato">
  <div>
    <section class="avviso-accesso">
      <h2>${e(GRUPPO.accesso.titolo)}</h2>
      <p>${e(GRUPPO.accesso.testo)}</p>
    </section>
    <section><h2>Che cos’è</h2><p>${e(GRUPPO.cosa)}</p></section>
    <section><h2>Chi ci lavora</h2><p>${e(GRUPPO.equipe)}</p></section>
    <section><h2>Il progetto della persona</h2><p>${e(GRUPPO.progetto)}</p></section>
    <section class="costi"><h2>${e(GRUPPO.costi.titolo)}</h2><p>${e(GRUPPO.costi.testo)}</p></section>
  </div>
  <aside class="lato">
    <div class="riquadro riservatezza">
      <h2>${e(GRUPPO.riservatezza.titolo)}</h2>
      <p>${e(GRUPPO.riservatezza.testo)}</p>
    </div>
    <div class="riquadro quieto"><h2>Sei un operatore del CSM?</h2>
      <p>Requisiti, disponibilità e il referente di settore stanno nell’area per i servizi invianti.</p>
      <span class="azione a-secondario largo">Vai all’area invianti</span></div>
  </aside>
</div>
${piede}`;

const AREA_INVIANTI = `
${nav('Per i servizi invianti')}
${briciole(['Home', 'Per i servizi invianti'])}
<header class="guscio apertura">
  <h1>${e(INVIANTI.titolo)}</h1>
  <p class="occhiello-testo">${e(INVIANTI.intro)}</p>
</header>
<section class="guscio sez">
  <ul class="impegni">
    ${INVIANTI.impegni.map(([n, d]) => `<li><strong class="numeri">${e(n)}</strong><span>${e(d)}</span></li>`).join('')}
  </ul>
  <p class="nota">Sono impegni che vincolano l’organizzazione, non il sito. Vanno confermati da chi
  dovrà mantenerli, o tolti.</p>
</section>
<section class="guscio sez">
  <h2>Disponibilità, per tipologia e provincia</h2>
  <div class="scroll"><table>
    <thead><tr><th scope="col">Tipologia</th><th scope="col">Province</th><th scope="col">Posti liberi</th></tr></thead>
    <tbody>${INVIANTI.disponibilita.map(([t, p, n]) => `<tr><td>${e(t)}</td><td>${e(p)}</td><td class="numeri">${e(n)}</td></tr>`).join('')}</tbody>
  </table></div>
  <p class="nota">${e(INVIANTI.notaDisponibilita)}</p>
</section>
<section class="guscio sez">
  <h2>Il referente, con il suo numero diretto</h2>
  <ul class="referenti">
    ${INVIANTI.referenti.map(([s, n, t]) => `<li><span class="etichetta">${e(s)}</span><strong>${e(n)}</strong><span class="mono">${e(t)}</span></li>`).join('')}
  </ul>
  <p class="nota">Non un centralino. ${e(INVIANTI.procedure)}</p>
</section>
${piede}`;

const ANNUNCIO_LAVORO = `
${nav('Lavora con noi')}
${briciole(['Home', 'Lavora con noi', ANNUNCIO.ruolo])}
<header class="guscio apertura">
  <div class="riga-meta"><span class="pillola s-anziani">${e(ANNUNCIO.dove)}</span></div>
  <h1>${e(ANNUNCIO.ruolo)}</h1>
  <div class="retribuzione">
    <p class="cifra numeri">${e(ANNUNCIO.retribuzione.range)}</p>
    <p>${e(ANNUNCIO.retribuzione.livello)}</p>
    <p class="mini">${e(ANNUNCIO.retribuzione.extra)}</p>
  </div>
  <p class="dati">${e(ANNUNCIO.contratto)}</p>
</header>
<div class="guscio impaginato">
  <div>
    <section><h2>Chi cerchiamo</h2><p>${e(ANNUNCIO.chiCerchiamo)}</p></section>
    <section><h2>Che cosa fai</h2><p>${e(ANNUNCIO.cosaFai)}</p></section>
    <section><h2>Come funziona la selezione</h2>
      <ol class="passi">
        ${ANNUNCIO.selezione.map(([q, d]) => `<li><span class="numero" aria-hidden="true"></span><div><h3>${e(q)}</h3><p>${e(d)}</p></div></li>`).join('')}
      </ol>
      <p class="nota">Tempi dichiarati: è una promessa che vincola noi, ed è per questo che funziona.</p>
    </section>
    <section><h2>Diventare socio</h2><p>${e(ANNUNCIO.socio)}</p></section>
  </div>
  <aside class="lato">
    <div class="riquadro"><h2>Candidati in tre minuti</h2>
      <p>${e(ANNUNCIO.candidatura)}</p>
      <div class="campo"><label>Nome e cognome <span>(obbligatorio)</span></label><input type="text" autocomplete="name"></div>
      <div class="campo"><label>Telefono <span>(obbligatorio)</span></label><input type="tel" autocomplete="tel" inputmode="tel"></div>
      <span class="azione a-primario largo">Invia la candidatura</span>
      <p class="mini">Due consensi distinti, nessuno preselezionato: uno per questa selezione, uno
      facoltativo per le posizioni future.</p></div>
  </aside>
</div>
${piede}`;

const PAGINE = [
  ['home', 'Home', HOME],
  ['trova', 'Trova un servizio', TROVA],
  ['rsa', 'Scheda RSA', SCHEDA_RSA],
  ['gruppo', 'Gruppo appartamento', GRUPPO_APP],
  ['invianti', 'Servizi invianti', AREA_INVIANTI],
  ['annuncio', 'Annuncio di lavoro', ANNUNCIO_LAVORO],
];

const html = `<title>Sito Anteo Impresa Sociale</title>
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
  body { margin: 0; background: var(--superficie-alt); color: var(--testo);
    font-family: var(--font-testo); font-size: var(--corpo-2);
    line-height: var(--interlinea-larga); -webkit-font-smoothing: antialiased; }
  h1,h2,h3 { font-family: var(--font-display); font-weight: 600; color: var(--inchiostro);
    line-height: 1.12; letter-spacing: -0.012em; margin: 0; text-wrap: balance; }
  h1 { font-size: var(--corpo-6); } h2 { font-size: var(--corpo-5); }
  h3 { font-size: var(--corpo-3); line-height: 1.3; }
  p { margin: 0; max-width: 65ch; }
  a { color: var(--primario); }
  ul, ol { margin: 0; padding: 0; }
  .numeri { font-variant-numeric: tabular-nums; }
  .etichetta { font-size: var(--corpo-1); font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--testo-tenue); }
  .mini { font-size: var(--corpo-1); color: var(--testo-tenue); }
  .nota { font-size: var(--corpo-1); color: var(--testo-secondario); margin-top: 16px; }

  /* ---------- la barra dell'anteprima, non fa parte del sito ---------- */
  .barra { position: sticky; top: 0; z-index: 10; background: var(--inchiostro);
    color: var(--fondo); padding: 12px 16px; display: flex; flex-wrap: wrap;
    gap: 8px 16px; align-items: center; }
  .barra .titolo { font-size: var(--corpo-1); font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; opacity: 0.72; margin-right: 8px; }
  .barra button { font: inherit; font-size: var(--corpo-1); font-weight: 500; cursor: pointer;
    background: transparent; color: inherit; border: 1px solid rgb(255 255 255 / 0.28);
    border-radius: 999px; padding: 6px 14px; }
  .barra button[aria-pressed="true"] { background: var(--fondo); color: var(--inchiostro);
    border-color: var(--fondo); font-weight: 600; }
  .barra .sep { flex: 1; }
  :is(button, input, a):focus-visible { outline: 3px solid var(--primario); outline-offset: 2px; }

  .palco { padding: 24px 16px 48px; }
  .telaio { background: var(--fondo); border: 1px solid var(--bordo); border-radius: var(--raggio);
    overflow: hidden; margin: 0 auto; max-width: 1180px; transition: max-width 200ms ease; }
  .telaio.telefono { max-width: 390px; }
  .pagina { display: none; }
  .pagina.viva { display: block; }

  /* ---------- il sito ---------- */
  .guscio { max-width: 1100px; margin: 0 auto; padding-inline: 16px; }
  .telaio.telefono .guscio { padding-inline: 16px; }
  .sito-testata { background: var(--superficie); border-bottom: 1px solid var(--bordo); }
  .riga-testata { display: flex; align-items: center; justify-content: space-between;
    gap: 24px; min-height: 68px; flex-wrap: wrap; padding-block: 12px; }
  .marchio { height: 48px; width: auto; display: block; flex: none; }
  .marchio-bianco { height: 60px; width: auto; display: block; margin-bottom: 16px; }
  .piede-riga { margin: 0; }
  .riga-testata nav { display: flex; flex-wrap: wrap; gap: 8px 24px; font-size: var(--corpo-1);
    color: var(--testo-secondario); font-weight: 500; }
  .riga-testata .attiva { color: var(--primario); font-weight: 600; box-shadow: inset 0 -2px 0 var(--primario); }

  .briciole { padding-top: 16px; font-size: var(--corpo-1); color: var(--testo-tenue); }
  .briciole span + span::before { content: "› "; color: var(--bordo-controllo); }
  .apertura { padding-top: 24px; }
  .apertura-home { padding-top: 40px; }
  .titolo-apertura { font-size: var(--corpo-7); margin-top: 8px; max-width: 18ch; }
  .occhiello-testo { font-size: var(--corpo-3); color: var(--testo-secondario); margin-top: 16px; }
  .sez { margin-top: 64px; }
  .sotto { margin-top: 12px; color: var(--testo-secondario); }
  .dati { margin-top: 12px; color: var(--testo-secondario); max-width: none; }
  .riga-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
  .apertura h1 { margin-top: 12px; }

  /* porte */
  .porte { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 16px; margin-top: 32px; }
  .porta { background: var(--superficie); border: 1px solid var(--bordo); border-radius: var(--raggio);
    padding: 24px; display: flex; flex-direction: column; gap: 12px; }
  .porta h2 { font-size: var(--corpo-4); }
  .porta-testo { font-size: var(--corpo-1); color: var(--testo-secondario); flex: 1; }
  .freccia { color: var(--primario); font-size: var(--corpo-4); line-height: 1; }

  /* settori */
  .griglia-settori { list-style: none; display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 16px; margin-top: 24px; }
  .scheda-settore { background: var(--superficie); border: 1px solid var(--bordo);
    border-radius: var(--raggio); padding: 28px 24px 24px; position: relative; overflow: hidden;
    display: flex; flex-direction: column; gap: 12px; }
  .scheda-settore::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 4px;
    background: var(--filetto); }
  .testa-settore { display: flex; align-items: baseline; justify-content: space-between;
    gap: 12px; flex-wrap: wrap; }
  .scheda-settore p { font-size: var(--corpo-1); color: var(--testo-secondario); }
  .accesso { color: var(--testo-tenue) !important; font-style: italic; }

  .s-salute-mentale { --filetto: var(--salute-mentale-grafico); --tinta: var(--salute-mentale-testo); --velo: var(--salute-mentale-fondo); }
  .s-anziani { --filetto: var(--anziani-grafico); --tinta: var(--anziani-testo); --velo: var(--anziani-fondo); }
  .s-disabilita { --filetto: var(--disabilita-grafico); --tinta: var(--disabilita-testo); --velo: var(--disabilita-fondo); }
  .s-minori { --filetto: var(--minori-grafico); --tinta: var(--minori-testo); --velo: var(--minori-fondo); }
  .s-dipendenze { --filetto: var(--dipendenze-grafico); --tinta: var(--dipendenze-testo); --velo: var(--dipendenze-fondo); }
  .s-sociale { --filetto: var(--sociale-grafico); --tinta: var(--sociale-testo); --velo: var(--sociale-fondo); }

  .pillola { display: inline-flex; padding: 4px 12px; border-radius: 999px;
    font-size: var(--corpo-1); font-weight: 600; white-space: nowrap;
    background: var(--velo, var(--superficie-alt)); color: var(--tinta, var(--testo-secondario)); }
  .p-positivo { background: var(--positivo-fondo); color: var(--positivo-testo); }
  .p-critico { background: var(--critico-fondo); color: var(--critico-testo); }
  .p-neutro { background: var(--superficie-alt); color: var(--testo-secondario); border: 1px solid var(--bordo); }

  /* azioni */
  .azione { display: inline-flex; align-items: center; justify-content: center; min-height: 52px;
    padding-inline: 24px; border-radius: var(--raggio); border: 1px solid transparent;
    font-size: var(--corpo-2); font-weight: 600; }
  .largo { width: 100%; }
  .a-primario { background: var(--primario); color: var(--superficie); }
  .a-secondario { background: var(--superficie); color: var(--primario); border-color: var(--primario); }
  .a-bianco { background: var(--superficie); color: var(--primario-scuro); }

  .riquadro-costi { background: var(--primario-chiaro); border: 1px solid var(--primario-bordo);
    border-radius: var(--raggio); padding: 32px; display: grid;
    grid-template-columns: minmax(0,2fr) minmax(0,1fr); gap: 32px; align-items: start; }
  .riquadro-costi p + p { margin-top: 12px; }
  .azioni-colonna { display: flex; flex-direction: column; gap: 12px; }
  .riquadro-lavoro { background: var(--primario-scuro); border-radius: var(--raggio); padding: 32px;
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px;
    color: #efeaf6; }
  .bianco { color: #ffffff; margin-top: 8px; }
  .riquadro-lavoro p { margin-top: 12px; }
  .chiara { color: #cbbde3; }

  /* sicurezza */
  .sicurezza { margin-top: 24px; background: var(--critico-fondo); border: 1px solid var(--critico-testo);
    border-radius: var(--raggio); padding: 20px 24px; display: flex; flex-direction: column; gap: 8px; }
  .sic-titolo { font-family: var(--font-display); font-size: var(--corpo-4); font-weight: 600;
    color: var(--critico-testo); }
  .sicurezza ul { list-style: none; display: flex; flex-direction: column; gap: 4px;
    font-size: var(--corpo-2); color: var(--critico-testo); }
  .sicurezza strong { font-family: var(--font-display); font-size: var(--corpo-3); }
  .sic-avviso { font-size: var(--corpo-1); color: var(--critico-testo); }
  .sic-esci { align-self: flex-start; background: var(--critico-testo); color: var(--superficie);
    border-radius: var(--raggio); padding: 8px 16px; font-size: var(--corpo-1); font-weight: 600; }

  /* filtro */
  .filtro { margin-top: 32px; display: flex; flex-direction: column; gap: 24px; }
  fieldset { border: 1px solid var(--bordo); border-radius: var(--raggio); padding: 16px 24px 24px; margin: 0; }
  legend { font-size: var(--corpo-1); font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--testo-tenue); padding-inline: 8px; }
  .opzioni { display: flex; flex-wrap: wrap; gap: 8px; }
  .opzione { border: 1px solid var(--bordo-opzione); border-radius: 999px; padding: 8px 16px;
    font-size: var(--corpo-1); color: var(--testo); background: var(--superficie); }

  .risultati { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
  .risultato { background: var(--superficie); border: 1px solid var(--bordo); border-radius: var(--raggio);
    border-left: 4px solid var(--filetto); padding: 16px 24px; display: flex; flex-wrap: wrap;
    align-items: center; justify-content: space-between; gap: 12px; }
  .risultato p { font-size: var(--corpo-1); color: var(--testo-secondario); margin-top: 4px; }

  /* scheda */
  .segnaposto { margin-top: 24px; background: var(--superficie-alt);
    border: 1px dashed var(--bordo-controllo); border-radius: var(--raggio); aspect-ratio: 21/9;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; text-align: center; padding: 24px; }
  .segnaposto p { color: var(--testo-tenue); }
  figcaption { font-size: var(--corpo-1); color: var(--testo-tenue); margin-top: 12px; max-width: 65ch; }
  .disponibilita { font-size: var(--corpo-1); color: var(--testo-secondario); font-weight: 600; }
  .disponibilita em { font-style: normal; font-weight: 400; color: var(--testo-tenue); }
  .impaginato { display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 48px;
    align-items: start; margin-top: 48px; }
  section + section { margin-top: 48px; }
  section h2 { margin-bottom: 16px; }
  section p + p { margin-top: 12px; }
  .non-e { border-left: 3px solid var(--filetto); padding-left: 16px; color: var(--testo-secondario); }
  .giornata { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .giornata li { display: grid; grid-template-columns: 4.5rem minmax(0,1fr); gap: 16px;
    padding-bottom: 12px; border-bottom: 1px solid var(--bordo); }
  .ora { font-family: var(--font-display); font-weight: 600; color: var(--tinta); }
  .costi { background: var(--primario-chiaro); border: 1px solid var(--primario-bordo);
    border-radius: var(--raggio); padding: 32px; }
  .voci { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .voci li { background: var(--superficie); border: 1px solid var(--primario-bordo);
    border-radius: 999px; padding: 4px 12px; font-size: var(--corpo-1); font-weight: 500;
    color: var(--primario-scuro); }
  .passi { list-style: none; display: flex; flex-direction: column; gap: 16px; }
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
  .nome { font-family: var(--font-display); font-size: var(--corpo-4); font-weight: 600; color: var(--inchiostro); }
  .ruolo { font-size: var(--corpo-1); color: var(--testo-tenue); }
  .atti { margin: 0; display: grid; grid-template-columns: auto minmax(0,1fr); gap: 8px 16px;
    font-size: var(--corpo-1); }
  .atti dt { font-weight: 600; color: var(--inchiostro); }
  .atti dd { margin: 0; color: var(--testo-secondario); }
  .lato { display: flex; flex-direction: column; gap: 16px; }
  .riquadro { background: var(--primario-chiaro); border: 1px solid var(--primario-bordo);
    border-radius: var(--raggio); padding: 24px; display: flex; flex-direction: column; gap: 12px; }
  .riquadro.quieto { background: var(--superficie); border-color: var(--bordo); }
  .riquadro h2 { font-size: var(--corpo-4); margin: 0; }
  .riquadro p { font-size: var(--corpo-1); color: var(--testo-secondario); }
  .indirizzo { font-weight: 600; color: var(--inchiostro) !important; }
  .arrivare { padding-left: 24px; font-size: var(--corpo-1); color: var(--testo-secondario); }
  .riservatezza { background: var(--salute-mentale-fondo); border-color: var(--primario-bordo); }
  .avviso-accesso { background: var(--attenzione-fondo); border-radius: var(--raggio); padding: 24px 32px; }
  .avviso-accesso h2 { color: var(--attenzione-testo); }
  .avviso-accesso p { color: var(--attenzione-testo); }

  /* invianti */
  .impegni { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
    gap: 16px; margin-top: 24px; }
  .impegni li { background: var(--superficie); border: 1px solid var(--bordo);
    border-radius: var(--raggio); padding: 24px; display: flex; flex-direction: column; gap: 4px; }
  .impegni strong { font-family: var(--font-display); font-size: var(--corpo-5); color: var(--primario); }
  .impegni span { font-size: var(--corpo-1); color: var(--testo-secondario); }
  .scroll { overflow-x: auto; margin-top: 16px; }
  table { border-collapse: collapse; width: 100%; font-size: var(--corpo-1); }
  th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--bordo); }
  th { font-weight: 600; color: var(--inchiostro); }
  .referenti { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px,1fr));
    gap: 12px; margin-top: 24px; }
  .referenti li { background: var(--superficie); border: 1px solid var(--bordo);
    border-radius: var(--raggio); padding: 16px; display: flex; flex-direction: column; gap: 4px; }
  .mono { font-variant-numeric: tabular-nums; color: var(--primario); font-weight: 600; }

  /* annuncio */
  .retribuzione { margin-top: 24px; background: var(--anziani-fondo); border-radius: var(--raggio);
    padding: 24px 32px; display: flex; flex-direction: column; gap: 4px; }
  .cifra { font-family: var(--font-display); font-size: var(--corpo-6); font-weight: 600;
    color: var(--anziani-testo); line-height: 1.1; }
  .retribuzione p { color: var(--anziani-testo); }
  .campo { display: flex; flex-direction: column; gap: 8px; }
  .campo label { font-weight: 600; color: var(--inchiostro); font-size: var(--corpo-2); }
  .campo label span { font-weight: 400; font-size: var(--corpo-1); color: var(--testo-tenue); }
  .campo input { min-height: 52px; padding: 12px 16px; border: 1px solid var(--bordo-controllo);
    border-radius: var(--raggio); background: var(--superficie); font: inherit; color: inherit; }

  .sito-piede { background: var(--primario-scuro); color: #d9d2e4; margin-top: 64px;
    padding-block: 32px; font-size: var(--corpo-1); }
  .piede-link { display: block; margin-top: 8px; color: #a99cbe; }

  @media (max-width: 62rem) {
    .impaginato, .riquadro-costi { grid-template-columns: 1fr; gap: 32px; }
    .impaginato { margin-top: 32px; }
  }
  .telaio.telefono .impaginato, .telaio.telefono .riquadro-costi { grid-template-columns: 1fr; gap: 24px; }
  .telaio.telefono .porte, .telaio.telefono .griglia-settori,
  .telaio.telefono .impegni, .telaio.telefono .referenti { grid-template-columns: 1fr; }
  .telaio.telefono .riga-testata nav { display: none; }
  .telaio.telefono .titolo-apertura { font-size: var(--corpo-6); }
</style>

<div class="barra">
  <span class="titolo">Anteprima</span>
  ${PAGINE.map(([id, nome], i) => `<button type="button" data-p="${id}" aria-pressed="${i === 0}">${nome}</button>`).join('')}
  <span class="sep"></span>
  <button type="button" id="tel" aria-pressed="false">Telefono</button>
</div>

<div class="palco">
  <div class="telaio" id="telaio">
${PAGINE.map(([id, , markup], i) => `    <div class="pagina${i === 0 ? ' viva' : ''}" id="p-${id}">${markup}</div>`).join('\n')}
  </div>
</div>

<script>
  (function () {
    var telaio = document.getElementById('telaio');
    document.querySelectorAll('[data-p]').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('[data-p]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        document.querySelectorAll('.pagina').forEach(function (p) { p.classList.remove('viva'); });
        document.getElementById('p-' + b.dataset.p).classList.add('viva');
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    });
    var t = document.getElementById('tel');
    t.addEventListener('click', function () {
      var on = t.getAttribute('aria-pressed') === 'true';
      t.setAttribute('aria-pressed', String(!on));
      telaio.classList.toggle('telefono', !on);
    });
  })();
</script>
`;

const dove = resolve(qui, '../dist-anteprima.html');
writeFileSync(dove, html, 'utf8');
console.log(`✓ Anteprima generata: ${dove} (${html.length} caratteri, ${PAGINE.length} schermate)`);
