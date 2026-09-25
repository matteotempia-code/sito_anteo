#!/usr/bin/env node
/**
 * Anteprima navigabile del nuovo sito.
 *
 * Seconda versione. La prima aveva un difetto grave: per far stare sei
 * schermate in un file avevo ridotto la testata a una riga di testo, il piè
 * di pagina a un'altra, e la home aveva perso il titolo che dice che cosa fa
 * Anteo Impresa Sociale, il paragrafo di identità, la fotografia, le icone
 * delle porte, i numeri dei settori e la fascia dei quattro numeri grandi.
 * Il risultato era più povero del prototipo da cui eravamo partiti.
 *
 * Qui la composizione torna quella dell'artboard. Restano soltanto le
 * correzioni che avevano una ragione: i contrasti, il colore che significa
 * settore e nient'altro, il blocco sicurezza, l'indirizzo oscurato dove
 * serve, nessun importo da nessuna parte.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { scheda as rsa } from '../src/content/rsa-gran-torino.js';
import { SICUREZZA, FUORI_ORARIO, RICERCA, GRUPPO, INVIANTI, ANNUNCIO } from '../src/content/schermate.js';
import { IDENTITA, NUMERI, PORTE, SETTORI } from '../src/content/anteo.js';
import { testata, piede, briciole, icona, e, SIMBOLI } from './pezzi.mjs';
import { NUOVE, CSS_NUOVE } from './pagine-nuove.mjs';

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

/* ============================================================== HOME ==== */
const HOME = `
${testata('')}

<section class="ingresso">
  <div class="guscio ingresso-griglia">
    <div class="ingresso-testo">
      <p class="etichetta">${e(IDENTITA.occhiello)}</p>
      <h1>${e(IDENTITA.titolo)}</h1>
      <p class="identita">${e(IDENTITA.testo)}</p>
    </div>
    <figure class="ingresso-foto">
      <div class="posa"><span class="etichetta">${e(IDENTITA.foto)}</span></div>
      <figcaption>${e(IDENTITA.fotoDidascalia)}</figcaption>
    </figure>
  </div>
</section>

<section class="porte-sez">
  <div class="guscio">
    <div class="titolo-doppio">
      <h2>Chi sei?</h2>
      <p>quattro modi di entrare — scegli il tuo</p>
    </div>
    <div class="porte">
      ${PORTE.map((p) => `
      <article class="porta">
        <span class="bolla">${icona(p.icona)}</span>
        <p class="etichetta">${e(p.occhiello)}</p>
        <h3>${e(p.titolo)}</h3>
        <p class="porta-testo">${e(p.testo)}</p>
        <a class="collegamento" href="#">${e(p.azione)} <span aria-hidden="true">→</span></a>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="fascia-numeri">
  <div class="guscio">
    <dl>
      ${NUMERI.map(([n, d]) => `<div><dt class="numeri">${e(n)}</dt><dd>${e(d)}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section class="settori-sez">
  <div class="guscio">
    <div class="titolo-doppio">
      <h2>Sei settori, <span class="numeri">347</span> servizi</h2>
      <p>in <span class="numeri">140</span> sedi, dal Piemonte alla Sicilia</p>
    </div>
    <ul class="griglia-settori">
      ${SETTORI.map((s) => `
      <li class="settore s-${s.codice}">
        <div class="settore-testa">
          <span class="sedi numeri">${s.sedi}</span>
          <span class="sedi-eti">sedi</span>
        </div>
        <h3>${e(s.nome)}</h3>
        <p>${e(s.testo)}</p>
        ${s.accessoDiretto ? '' : '<p class="accesso">Si entra tramite il servizio pubblico inviante.</p>'}
        <a class="collegamento" href="#">Vai al settore <span aria-hidden="true">→</span></a>
      </li>`).join('')}
    </ul>
  </div>
</section>

<!-- Prima questi due blocchi erano due rettangoli colorati posati uno sotto
     l'altro sullo stesso fondo, dopo altri dieci rettangoli. La pagina era
     diventata una pila di scatole tutte uguali: è la ragione per cui chi la
     guardava diceva che «è tutto uguale». Qui il primo è un blocco
     editoriale con un filetto, il secondo è una fascia a tutta larghezza
     che chiude la pagina sul fondo scuro del piede. -->
<section class="costo-sez">
  <div class="guscio costo-griglia">
    <div class="costo-testo">
      <p class="etichetta">Parliamone</p>
      <h2>Quanto costa</h2>
      <p>Non pubblichiamo un listino, perché sarebbe un numero falso: la quota sanitaria è a carico
      dell’ASL, la quota alberghiera della famiglia, ed esistono detrazioni e contributi regionali
      che cambiano da territorio a territorio.</p>
      <p>La cifra esatta arriva scritta, voce per voce, <strong>entro 48 ore dalla visita</strong> e
      prima di qualsiasi firma. Prima però parliamo della persona.</p>
    </div>
    <div class="azioni-colonna">
      <a class="azione a-primario" href="#">Fatti richiamare</a>
      <a class="azione a-secondario" href="#">Guarda i servizi</a>
      <p class="mini fuori-orario">${e(FUORI_ORARIO)}</p>
    </div>
  </div>
</section>

<section class="fascia-lavoro">
  <div class="guscio fascia-lavoro-griglia">
    <div>
      <p class="etichetta chiara">Stiamo assumendo</p>
      <h2 class="bianco">[N] posizioni aperte in [N] province</h2>
      <p>OSS, infermieri, educatori, psicologi, coordinatori. CCNL Cooperative sociali, formazione
      pagata, retribuzione dichiarata in ogni annuncio, e dopo tre anni la possibilità di diventare
      socio — con quello che comporta, spiegato prima.</p>
    </div>
    <a class="azione a-bianco" href="#">Vedi le posizioni</a>
  </div>
</section>
${piede}`;

/* ============================================================= TROVA ==== */
const TROVA = `
${testata('I servizi')}
${briciole(['Home', 'I servizi'])}
<section class="guscio apertura">
  <h1>${e(RICERCA.titolo)}</h1>
  <p class="occhiello-testo">${e(RICERCA.intro)}</p>
  <!-- Il blocco sicurezza era un pannello alto duecento pixel in cima a una
       pagina che per quasi tutti è «cerco una RSA per mio padre». Deve
       restare impossibile da non vedere per chi ne ha bisogno, senza
       diventare la cosa più grande della pagina per tutti gli altri: qui è
       una striscia compatta, con i numeri in evidenza e l'uscita rapida a
       destra, dove la mano la trova subito. -->
  <aside class="sicurezza" aria-label="Se sei in pericolo">
    <div class="sic-corpo">
      <h2 class="sic-titolo">${e(SICUREZZA.titolo)}</h2>
      <ul>${SICUREZZA.righe
        .map(([n, d]) => `<li><a class="sic-numero numeri" href="tel:${e(n)}">${e(n)}</a> <span>${e(d)}</span></li>`)
        .join('')}</ul>
      <p class="sic-avviso">${e(SICUREZZA.avviso)}</p>
    </div>
    <button type="button" class="sic-esci">${e(SICUREZZA.uscita)}</button>
  </aside>
  <!-- Le opzioni erano <span>: un modulo che si guarda e non si compila.
       Qui sono comandi veri, nessuno preselezionato, e il metodo è POST —
       perché ciò che si sceglie qui rivela una condizione di salute e non
       deve finire nella barra dell'indirizzo, né nella cronologia, né nei
       log del server. -->
  <form class="filtro" method="post" action="/servizi/risultati" onsubmit="return false">
    ${RICERCA.passi.map((p, i) => `
    <fieldset>
      <legend>${e(p.legenda)}</legend>
      <div class="opzioni">${p.opzioni
        .map(
          (o, j) => `<label class="opzione"><input type="radio" name="passo-${i + 1}"
            id="passo-${i + 1}-${j}" value="${j}"><span>${e(o)}</span></label>`,
        )
        .join('')}</div>
    </fieldset>`).join('')}
    <button type="submit" class="azione a-primario invia">${e(RICERCA.azione)}</button>
    <p class="nota">${e(RICERCA.nota)}</p>
  </form>
</section>
<section class="guscio sez">
  <h2>${e(RICERCA.esito)}</h2>
  <ul class="risultati">
    ${[['anziani', 'RSA Gran Torino', 'Residenza sanitaria per anziani · Torino', '[N] posti disponibili', 'libero'],
       ['anziani', 'Casa di riposo [NOME]', 'Casa di riposo · [COMUNE]', 'Lista d’attesa', 'attesa'],
       ['salute-mentale', 'Centro diurno [NOME]', 'Centro diurno · [COMUNE]', 'Su invio del CSM', 'invio']]
      .map(([cod, nome, tipo, stato, cls]) => `
    <li class="risultato s-${cod}">
      <div><h3>${e(nome)}</h3><p>${e(tipo)}</p></div>
      <span class="stato ${cls}">${e(stato)}</span>
    </li>`).join('')}
  </ul>
  <p class="fuori-elenco">Non trovi quello che cerca? <a href="#">Dicci che cosa serve</a>: se il
  servizio adatto non è nostro, ti indirizziamo comunque.</p>
</section>
${piede}`;

/* ========================================================= SCHEDA RSA === */
const SCHEDA_RSA = `
${testata('I servizi')}
${briciole(rsa.percorso)}
<header class="guscio apertura">
  <div class="riga-meta">
    <span class="pillola s-anziani">${e(rsa.tipologia)}</span>
    <span class="disponibilita">${e(rsa.disponibilita.testoSegnaposto)}
      <em>· dal gestionale, con la data di aggiornamento</em></span>
  </div>
  <h1>${e(rsa.nome)}</h1>
  <p class="dati numeri">${e(rsa.indirizzo)} · <strong>${rsa.postiLetto}</strong> posti letto · aperta nel ${e(rsa.apertaNel)}</p>
  <dl class="dati-chiave">
    <div><dt>Operatori per ospite</dt>
      <dd><span class="numeri">1 ogni ${e(rsa.rapportoGiorno)}</span> di giorno ·
        <span class="numeri">1 ogni ${e(rsa.rapportoNotte)}</span> di notte</dd></div>
    <div><dt>Attesa media</dt><dd>${e(rsa.attesaMedia)}</dd></div>
  </dl>
</header>
<div class="guscio">
  <figure style="margin:0">
    <div class="posa larga"><span class="etichetta">${e(rsa.galleria.segnaposto)}</span>
      <span class="posa-sotto">${e(rsa.galleria.didascalia)}</span></div>
    <figcaption>${e(rsa.galleria.nota)}</figcaption>
  </figure>
</div>
<div class="guscio impaginato">
  <div>
    <section><h2>${e(rsa.perChi.titolo)}</h2><p>${e(rsa.perChi.si)}</p>
      <p class="non-e s-anziani">${e(rsa.perChi.no)}</p></section>
    <section><h2>Una giornata qui</h2>
      <p class="premessa">${e(rsa.giornataPremessa)}</p>
      <ol class="giornata">
      ${rsa.giornata.map(([o, c]) => `<li><span class="ora s-anziani numeri">${e(o)}</span><span>${e(c)}</span></li>`).join('')}
    </ol></section>
    <section class="costi"><h2>${e(rsa.costi.titolo)}</h2>
      ${rsa.costi.testo.map((t) => `<p>${e(t)}</p>`).join('')}
      <ul class="voci">${rsa.costi.voci.map((v) => `<li>${e(v)}</li>`).join('')}</ul></section>
    <section><h2>Come si entra</h2><ol class="passi">
      ${rsa.ingresso.map(([t, d]) => `<li><span class="numero" aria-hidden="true"></span><div><h3>${e(t)}</h3><p>${e(d)}</p></div></li>`).join('')}
    </ol><p class="nota"><a href="#">Documenti da portare: l’elenco completo</a></p></section>
    <section><h2>Chi risponde, qui dentro</h2>
      <div class="referente"><div class="ritratto" aria-hidden="true">[FOTO]</div>
      <div><h3 class="nome">${e(rsa.direttore.nome)}</h3>
      <p class="ruolo">${e(rsa.direttore.ruolo)} · qui dal ${e(rsa.direttore.dal)}</p>
      <p>${e(rsa.direttore.nota)}</p></div></div>
      <p class="nota-progetto">Nota di progetto — nome e fotografia compaiono solo con due
      consensi distinti, e il gestionale non restituisce il campo se mancano.</p></section>
    <section><h2>Autorizzazione e qualità</h2><dl class="atti">
      ${rsa.autorizzazioni.map(([v, x]) => `<dt>${e(v)}</dt><dd>${e(x)}</dd>`).join('')}
    </dl><p class="nota">${e(rsa.cartaDeiServizi)}</p></section>
  </div>
  <aside class="lato">
    <div class="riquadro"><h2>${e(rsa.visita.titolo)}</h2><p>${e(rsa.visita.testo)}</p>
      <!-- Il testo e il numero stanno in un unico elemento: .azione è un
           contenitore flex, e uno spazio fra due elementi flex viene
           eliminato dal browser. Si leggeva «Chiama ora ·800 127 996». -->
      <a class="azione a-primario largo telefono-azione" href="tel:+39800127996"><span
        >Chiama ora · <span class="numeri">${e(rsa.telefono.numero)}</span></span></a>
      <p class="mini">${e(rsa.telefono.orari)}. ${e(FUORI_ORARIO)}</p>
      <a class="azione a-secondario largo" href="#">Prenota una visita</a>
      <a class="azione a-secondario largo" href="#">Fatti richiamare</a></div>
    <div class="riquadro quieto"><h2>Dove si trova</h2>
      <p class="indirizzo">${e(rsa.indirizzo)}</p>
      <ul class="arrivare">${rsa.comeArrivare.map((r) => `<li>${e(r)}</li>`).join('')}</ul>
      <div class="posa mappa"><span class="etichetta">[MAPPA]</span></div></div>
    <div class="riquadro quieto"><h2>Lavori nel settore?</h2><p>${e(rsa.lavoro)}</p>
      <a class="collegamento" href="#">Vedi le posizioni qui <span aria-hidden="true">→</span></a></div>
  </aside>
</div>
${piede}`;

/* ==================================================== GRUPPO APPART. ==== */
const GRUPPO_APP = `
${testata('I servizi')}
${briciole(['Home', 'I servizi', 'Salute mentale', 'Vercelli', GRUPPO.nome])}
<header class="guscio apertura">
  <div class="riga-meta"><span class="pillola s-salute-mentale">${e(GRUPPO.tipologia)}</span></div>
  <h1>${e(GRUPPO.nome)}</h1>
  <p class="dati">${e(GRUPPO.dove)}</p>
</header>
<div class="guscio impaginato">
  <div>
    <section class="avviso-accesso"><h2>${e(GRUPPO.accesso.titolo)}</h2><p>${e(GRUPPO.accesso.testo)}</p></section>
    <section><h2>Che cos’è</h2><p>${e(GRUPPO.cosa)}</p></section>
    <section><h2>Chi ci lavora</h2><p>${e(GRUPPO.equipe)}</p></section>
    <section><h2>Il progetto della persona</h2><p>${e(GRUPPO.progetto)}</p></section>
    <section class="costi"><h2>${e(GRUPPO.costi.titolo)}</h2><p>${e(GRUPPO.costi.testo)}</p></section>
  </div>
  <aside class="lato">
    <div class="riquadro riservatezza"><h2>${e(GRUPPO.riservatezza.titolo)}</h2>
      <p>${e(GRUPPO.riservatezza.testo)}</p></div>
    <div class="riquadro quieto"><h2>Sei un operatore del CSM?</h2>
      <p>Requisiti, disponibilità e il referente di settore stanno nell’area per i servizi invianti.</p>
      <span class="azione a-secondario largo">Vai all’area invianti</span></div>
  </aside>
</div>
${piede}`;

/* ========================================================== INVIANTI ==== */
const AREA_INVIANTI = `
${testata('Per i servizi invianti')}
${briciole(['Home', 'Per i servizi invianti'])}
<header class="guscio apertura">
  <h1>${e(INVIANTI.titolo)}</h1>
  <p class="occhiello-testo">${e(INVIANTI.intro)}</p>
</header>
<section class="guscio sez">
  <ul class="impegni">
    ${INVIANTI.impegni.map(([n, d]) => `<li><strong class="numeri">${e(n)}</strong><span>${e(d)}</span></li>`).join('')}
  </ul>
  <p class="nota-progetto">Nota di progetto — non è testo della pagina. Questi tre impegni
  vincolano l’organizzazione, non il sito: vanno confermati da chi dovrà mantenerli, o tolti.</p>
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

/* ========================================================== ANNUNCIO ==== */
const ANNUNCIO_LAVORO = `
${testata('Lavora con noi')}
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
    <section><h2>Come funziona la selezione</h2><ol class="passi">
      ${ANNUNCIO.selezione.map(([q, d]) => `<li><span class="numero" aria-hidden="true"></span><div><h3>${e(q)}</h3><p>${e(d)}</p></div></li>`).join('')}
    </ol><p class="nota-progetto">Nota di progetto — i tempi dichiarati vincolano chi seleziona.
      Vanno confermati dalle risorse umane prima della pubblicazione.</p></section>
    <section><h2>Diventare socio</h2><p>${e(ANNUNCIO.socio)}</p></section>
  </div>
  <aside class="lato">
    <div class="riquadro"><h2>Candidati in tre minuti</h2><p>${e(ANNUNCIO.candidatura)}</p>
      <!-- Le etichette non erano associate a niente: un <label> senza «for»
           non dice allo schermo parlante a quale casella appartiene, e un
           tocco sull'etichetta non porta il cursore nel campo. -->
      <form class="modulo-breve" method="post" action="/candidature" onsubmit="return false">
        <div class="campo"><label for="c-nome">Nome e cognome <span>(obbligatorio)</span></label>
          <input id="c-nome" name="nome" type="text" autocomplete="name" required aria-required="true"></div>
        <div class="campo"><label for="c-tel">Telefono <span>(obbligatorio)</span></label>
          <input id="c-tel" name="telefono" type="tel" autocomplete="tel" inputmode="tel"
            required aria-required="true"></div>
        <div class="campo"><label class="consenso" for="c-questa">
          <input id="c-questa" name="consenso-selezione" type="checkbox" value="si" required aria-required="true">
          <span>Acconsento al trattamento dei dati per questa selezione
          <span class="obbligo">(obbligatorio)</span></span></label></div>
        <div class="campo"><label class="consenso" for="c-future">
          <input id="c-future" name="consenso-future" type="checkbox" value="si">
          <span>Conservate la mia candidatura per le posizioni future
          <span class="obbligo">(facoltativo)</span></span></label></div>
        <button type="submit" class="azione a-primario largo">Invia la candidatura</button>
      </form>
      <p class="mini">Due consensi distinti, nessuno preselezionato: uno per questa selezione, uno
      facoltativo per le posizioni future.</p></div>
  </aside>
</div>
${piede}`;

/**
 * Ogni schermata deve avere un <main>, e il salto al contenuto della testata
 * deve atterrare lì. Nessuna delle tredici ce l'aveva: il link «Vai al
 * contenuto» sarebbe stato un link che non porta da nessuna parte, cioè
 * peggio della sua assenza.
 *
 * Il taglio è strutturale e non a occhio: il contenuto comincia dopo la
 * testata — il primo </header> della pagina, che è sempre il suo — e
 * finisce dove comincia il piè di pagina.
 */
const FINE_TESTATA = '</header>';
const INIZIO_PIEDE = '<footer class="sito-piede">';

function inquadra(markup, id) {
  const a = markup.indexOf(FINE_TESTATA);
  const b = markup.lastIndexOf(INIZIO_PIEDE);
  if (a < 0 || b < 0) throw new Error('Schermata senza testata o senza piè di pagina.');
  const taglio = a + FINE_TESTATA.length;
  /* Nel sito vero ogni schermata è un documento a sé e l'ancora si chiama
     «contenuto». Qui le tredici stanno in un file solo: con lo stesso id
     tredici volte, ogni salto atterrava sulla home. L'ancora prende quindi
     il nome della schermata, e il collegamento della testata la segue. */
  const meta = `contenuto-${id}`;
  return (
    markup.slice(0, taglio).replace('href="#contenuto"', `href="#${meta}"`) +
    `\n<main id="${meta}" tabindex="-1">` +
    markup.slice(taglio, b) +
    '</main>\n' +
    markup.slice(b)
  );
}

const PAGINE = [
  ['home', 'Home', HOME],
  ['trova', 'Trova un servizio', TROVA],
  ['settore', 'Pagina settore', null],
  ['territorio', 'Pagina provincia', null],
  ['rsa', 'Scheda RSA', SCHEDA_RSA],
  ['gruppo', 'Gruppo appartamento', GRUPPO_APP],
  ['guida', 'Guida', null],
  ['richiamata', 'Richiamata', null],
  ['invianti', 'Servizi invianti', AREA_INVIANTI],
  ['lavoro', 'Lavora con noi', null],
  ['annuncio', 'Annuncio di lavoro', ANNUNCIO_LAVORO],
  ['enti', 'Enti e gare', null],
  ['chisiamo', 'Chi siamo', null],
].map(([id, nome, markup]) => [id, nome, inquadra(markup ?? NUOVE.find((n) => n[0] === id)[2], id)]);

const html = `<meta charset="utf-8">
<title>Sito Anteo Impresa Sociale</title>
<!-- La dichiarazione di codifica e la lingua del documento.
     Senza la prima, aperto da disco il file veniva letto come windows-1252
     e mezza pagina diventava «disabilitÃ », «347Â servizi»: gli spazi
     unificatori fra numero e unità, che servono proprio a non spezzare
     «347 servizi» a fine riga, si vedevano come un carattere sbagliato.
     Senza la seconda, lo schermo parlante legge l'italiano con la fonetica
     inglese, che è un requisito mancato (WCAG 3.1.1) prima ancora che una
     sgradevolezza. Va impostata da script perché questa pagina viene
     pubblicata dentro uno scheletro che non controlliamo. -->
<script>document.documentElement.lang = 'it';</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600&display=swap">
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
    line-height: 1.12; letter-spacing: -0.014em; margin: 0; text-wrap: balance; }
  h1 { font-size: var(--corpo-6); } h2 { font-size: var(--corpo-5); }
  h3 { font-size: var(--corpo-3); line-height: 1.3; }
  p { margin: 0; max-width: 65ch; }
  ul, ol, dl { margin: 0; padding: 0; }
  .numeri { font-variant-numeric: tabular-nums; }
  .etichetta { font-size: var(--corpo-1); font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--testo-tenue); }
  .mini { font-size: var(--corpo-1); color: var(--testo-tenue); }
  .nota { font-size: var(--corpo-1); color: var(--testo-secondario); margin-top: var(--sp-4); }
  /* Non fa parte della pagina: è un'annotazione per chi la sta valutando.
     Prima aveva lo stesso stile delle didascalie vere, e un revisore non
     poteva distinguere il contenuto dal commento. */
  .nota-progetto { font-size: var(--corpo-1); color: var(--attenzione-testo);
    background: var(--attenzione-fondo); border-left: 3px solid var(--attenzione-testo);
    padding: var(--sp-3) var(--sp-4); margin-top: var(--sp-4); max-width: var(--misura);
    font-style: italic; }
  .fuori-elenco { margin-top: var(--sp-5); font-size: var(--corpo-2);
    color: var(--testo-secondario); }
  .icona { width: 40px; height: 40px; }
  .icona.piccola { width: 20px; height: 20px; }
  /* Prima 32 «collegamenti» erano <span>: non raggiungibili da tastiera e
     senza nessuna reazione al passaggio del mouse. Per un pubblico spesso
     ultrasessantenne l'affordance è tutto. */
  .collegamento { color: var(--primario); font-weight: 600; font-size: var(--corpo-1);
    text-decoration: underline; text-decoration-thickness: 1px;
    text-underline-offset: 0.2em; }
  a.collegamento:hover { color: var(--primario-scuro); text-decoration-thickness: 2px; }
  .scheda-viva { transition: border-color var(--transizione), box-shadow var(--transizione); }
  .scheda-viva:hover { border-color: var(--bordo-controllo); box-shadow: var(--ombra); }
  a { color: var(--primario); text-underline-offset: 0.18em; }
  :is(a, button, summary, input, textarea):focus-visible {
    outline: var(--focus) solid var(--primario);
    outline-offset: var(--focus-scostamento); border-radius: var(--sp-1); }
  .fascia-numeri :focus-visible, .riquadro-lavoro :focus-visible,
  .sito-piede :focus-visible, .barra-servizio :focus-visible {
    outline-color: var(--focus-su-scuro); }

  /* ------- barra dell'anteprima, non fa parte del sito ------- */
  .barra { position: sticky; top: 0; z-index: 20; background: var(--inchiostro);
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
    overflow: hidden; margin: 0 auto; max-width: 1240px; transition: max-width 200ms ease; }
  .telaio.telefono { max-width: 390px; }
  .pagina { display: none; } .pagina.viva { display: block; }

  /* ================= il sito ================= */
  .guscio { max-width: 1160px; margin: 0 auto; padding-inline: 16px; }

  /* Il salto al contenuto. Invisibile finché non lo si raggiunge con il
     tabulatore, e allora visibilissimo: se compare mezzo trasparente o
     sotto la testata, non ha assolto il suo compito. */
  .salta { position: absolute; left: var(--sp-4); top: -100px; z-index: 60;
    background: var(--primario); color: var(--superficie); text-decoration: none;
    font-weight: 600; padding: var(--sp-3) var(--sp-5); border-radius: var(--raggio);
    transition: top var(--transizione); }
  .salta:focus { top: var(--sp-3); }
  main:focus { outline: none; }

  .barra-servizio { background: var(--fondo-scuro); color: var(--su-scuro); font-size: var(--corpo-1); }
  .riga-servizio { display: flex; flex-wrap: wrap; gap: var(--sp-2) var(--sp-6); align-items: center;
    justify-content: space-between; padding-block: var(--sp-1); min-height: 40px; }
  .servizio-destra { display: flex; flex-wrap: wrap; gap: var(--sp-2) var(--sp-6); align-items: center; }
  /* Il numero verde nella barra era alto diciassette pixel: sotto il minimo
     di WCAG 2.5.8, e su un sito dove il pubblico chiama più di quanto
     scriva è proprio il bersaglio da non sbagliare. */
  .numero-verde { display: inline-flex; align-items: center; min-height: 28px;
    color: var(--su-scuro-forte); font-weight: 600; text-decoration: none; }
  .numero-verde:hover { text-decoration: underline; text-underline-offset: 0.2em; }
  .soci { display: inline-flex; align-items: center; min-height: 28px;
    color: var(--su-scuro); text-decoration: none;
    border: 1px solid var(--bordo-su-scuro-forte); border-radius: var(--raggio-pieno);
    padding-inline: var(--sp-3); }
  .soci:hover { background: var(--bordo-su-scuro); color: var(--su-scuro-forte); }

  .sito-testata { background: var(--superficie); border-bottom: 1px solid var(--bordo); }
  .riga-testata { display: flex; align-items: center; gap: 32px; min-height: 88px;
    padding-block: 12px; flex-wrap: wrap; }
  .marchio { height: 56px; width: 58px; display: block; flex: none; }
  .marchio-collegamento { display: block; flex: none; border-radius: var(--raggio); }
  .riga-testata nav { display: flex; flex-wrap: wrap; gap: var(--sp-2) var(--sp-6); font-size: var(--corpo-1);
    font-weight: 500; flex: 1; }
  /* Le voci di menu erano <span>: non si raggiungevano con il tabulatore e
     non reagivano al passaggio del mouse. Adesso sono collegamenti, e il
     bersaglio è alto 44 px anche quando la parola è corta. */
  .riga-testata nav a { display: inline-flex; align-items: center; min-height: 44px;
    color: var(--testo-secondario); text-decoration: none; }
  .riga-testata nav a:hover { color: var(--primario); text-decoration: underline;
    text-underline-offset: 0.25em; }
  .riga-testata .attiva { color: var(--primario); font-weight: 600;
    box-shadow: inset 0 -2px 0 var(--primario); }
  .ricerca { display: inline-flex; align-items: center; gap: var(--sp-2);
    color: var(--testo-secondario); background: var(--superficie);
    border: 1px solid var(--bordo-controllo);
    border-radius: var(--raggio-pieno); padding: var(--sp-2) var(--sp-4);
    font: inherit; font-size: var(--corpo-1); min-height: 44px; cursor: pointer; }
  .ricerca:hover { border-color: var(--primario); color: var(--primario); }
  .menu-telefono { display: none; align-items: center; justify-content: center;
    width: 48px; height: 48px; border: 1px solid var(--bordo-controllo);
    border-radius: var(--raggio); background: var(--superficie);
    color: var(--inchiostro); font: inherit; font-size: var(--corpo-1);
    font-weight: 600; cursor: pointer; }

  /* ---------------- ingresso ---------------- */
  .ingresso { background: var(--superficie); border-bottom: 1px solid var(--bordo);
    padding-block: var(--sp-7) var(--sp-9); }
  .ingresso-griglia { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: 56px; align-items: center; }
  .ingresso h1 { font-size: var(--corpo-7); margin-top: 12px; letter-spacing: -0.022em;
    max-width: 22ch; }
  .identita { margin-top: 24px; font-size: var(--corpo-3); color: var(--testo-secondario); }
  .ingresso-foto { margin: 0; }
  /* Un solo idioma per i segnaposto: prima ne convivevano quattro e il
     risultato sembrava un lavoro incompiuto invece di una scelta. */
  .posa { background: var(--superficie-alt); border: 1px dashed var(--bordo-controllo);
    border-radius: var(--raggio); aspect-ratio: 4/3; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: var(--sp-2); text-align: center;
    padding: var(--sp-5); color: var(--testo-tenue); }
  .posa.larga { aspect-ratio: 21/9; margin-top: var(--sp-5); }
  .posa.mappa { aspect-ratio: 16/10; }
  .posa-sotto { font-size: var(--corpo-1); color: var(--testo-tenue); }
  .ingresso-foto figcaption { font-size: var(--corpo-1); color: var(--testo-tenue); margin-top: 12px; }
  figcaption { font-size: var(--corpo-1); color: var(--testo-tenue); margin-top: 12px; max-width: 65ch; }

  /* ---------------- le quattro porte ---------------- */
  .porte-sez { padding-block: var(--sp-9); }
  .porte { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px; margin-top: 32px; }
  .porta { background: var(--primario-chiaro); border: 1px solid var(--primario-bordo);
    border-radius: var(--raggio); padding: var(--sp-6) var(--sp-5); display: flex; flex-direction: column;
    gap: 12px; }
  .bolla { width: 64px; height: 64px; border-radius: 999px; background: var(--superficie);
    color: var(--primario); display: grid; place-items: center; margin-bottom: 4px; }
  /* «Per me o per una persona a cui tengo» va a capo, «Cerco lavoro» no:
     senza un'altezza minima i quattro titoli delle porte partivano da
     quattro quote diverse e la fila sembrava montata male. Due righe è lo
     spazio che serve al più lungo. */
  .porta .etichetta { line-height: var(--interlinea-media);
    min-height: calc(2 * var(--corpo-1) * var(--interlinea-media)); }
  .porta h3 { font-size: var(--corpo-4);
    min-height: calc(2 * var(--corpo-4) * var(--interlinea-media)); }
  .porta-testo { font-size: var(--corpo-1); color: var(--testo-secondario); flex: 1; }
  .porta .collegamento { margin-top: auto; }

  /* ---------------- la fascia dei numeri ---------------- */
  .fascia-numeri { background: var(--fondo-scuro); color: var(--su-scuro); padding-block: var(--sp-9); }
  .fascia-numeri dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 32px; }
  .fascia-numeri dt { font-family: var(--font-display); font-weight: 700; font-size: var(--corpo-7);
    line-height: 1; color: var(--su-scuro-forte); letter-spacing: -0.03em; }
  .fascia-numeri dd { margin: var(--sp-2) 0 0; font-size: var(--corpo-1); color: var(--su-scuro-tenue); }

  /* ---------------- settori ----------------
     La sezione sta su fondo bianco a tutta larghezza e le schede sono
     crema: prima erano schede bianche su fondo crema, cioè lo stesso
     accostamento delle quattro porte sopra e della fascia costi sotto.
     Alternare i fondi è ciò che dà un ritmo alla pagina; ripetere lo stesso
     rettangolo dodici volte è ciò che la fa sembrare «tutta uguale». */
  .settori-sez { padding-block: var(--sp-9); background: var(--superficie);
    border-block: 1px solid var(--bordo); }
  .titolo-doppio { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px 16px; }
  .titolo-doppio p { color: var(--testo-tenue); font-size: var(--corpo-3); }
  .griglia-settori { list-style: none; display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 32px; }
  .settore { background: var(--superficie-alt); border: 1px solid var(--bordo);
    border-radius: var(--raggio); padding: var(--sp-6) var(--sp-5) var(--sp-5); position: relative; overflow: hidden;
    display: flex; flex-direction: column; gap: 8px;
    transition: border-color var(--transizione), box-shadow var(--transizione); }
  .settore:hover { border-color: var(--bordo-controllo); box-shadow: var(--ombra); }
  .settore::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 4px;
    background: var(--filetto); }
  .settore-testa { display: flex; align-items: baseline; gap: 8px; }
  .sedi { font-family: var(--font-display); font-weight: 700; font-size: var(--corpo-6);
    line-height: 1; color: var(--tinta); letter-spacing: -0.03em; }
  .sedi-eti { font-size: var(--corpo-1); color: var(--testo-tenue); font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; }
  .settore h3 { font-size: var(--corpo-4); }
  .settore p { font-size: var(--corpo-1); color: var(--testo-secondario); flex: 0; }
  .settore .collegamento { margin-top: auto; padding-top: 8px; }
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
  /* Lo stato si legge per FORMA — un glifo e il peso — su fondo neutro.
     Il colore resta al settore: prima «posti disponibili» era il verde di
     «anziani» e «lista d'attesa» il rosso di «dipendenze», cioè la regola
     del progetto violata dal progetto. Funziona anche per chi i colori non
     li distingue. */
  .stato { display: inline-flex; align-items: center; gap: var(--sp-2);
    padding: var(--sp-1) var(--sp-3); border-radius: var(--raggio-pieno);
    font-size: var(--corpo-1); font-weight: 600; white-space: nowrap;
    background: var(--stato-fondo); color: var(--stato-testo);
    border: 1px solid var(--stato-bordo); }
  .stato::before { font-size: 0.9em; line-height: 1; }
  .stato.libero::before { content: "●"; }
  .stato.attesa::before { content: "◐"; }
  .stato.invio::before { content: "○"; }

  /* .azione veste tre elementi diversi — <button>, <a>, e in anteprima
     qualche <span> ancora senza destinazione. Le proprietà che un <button>
     non eredita (font, cursore) e quelle che un <a> aggiunge da sé
     (sottolineatura) vanno dichiarate qui, o i due non si somigliano. */
  .azione { display: inline-flex; align-items: center; justify-content: center; min-height: 52px;
    padding-inline: 24px; border-radius: var(--raggio); border: 1px solid transparent;
    font: inherit; font-size: var(--corpo-2); font-weight: 600; text-decoration: none;
    text-align: center; cursor: pointer; }
  .largo { width: 100%; }
  /* Un pulsante largo un metro non è un pulsante: è una fascia. Si ferma
     dove finisce la misura naturale di un comando. */
  .invia { align-self: flex-start; min-width: 16rem; }
  .a-primario { background: var(--primario); color: var(--superficie); }
  a.a-primario:hover, button.a-primario:hover { background: var(--primario-scuro); }
  .a-secondario { background: var(--superficie); color: var(--primario); border-color: var(--primario); }
  a.a-secondario:hover, button.a-secondario:hover { background: var(--primario-chiaro); }
  .a-bianco { background: var(--su-scuro-forte); color: var(--fondo-scuro); }
  .modulo-breve { display: flex; flex-direction: column; gap: var(--sp-4); }

  .sez { margin-top: var(--sp-8); }
  .telefono-azione { text-decoration: none; }

  /* ---------------- la coda della home ---------------- */
  .costo-sez { padding-block: var(--sp-9); }
  /* Il filetto attraversa tutte e due le colonne: se sta solo sopra il
     testo, i due pulsanti a destra galleggiano senza una linea a cui
     appoggiarsi. */
  .costo-griglia { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: var(--sp-7); align-items: start; border-top: 3px solid var(--primario);
    padding-top: var(--sp-5); }
  .costo-testo h2 { margin-top: var(--sp-2); margin-bottom: var(--sp-4); font-size: var(--corpo-6); }
  .costo-testo p + p { margin-top: var(--sp-4); }
  .fuori-orario { margin-top: var(--sp-2); }
  .fascia-lavoro { background: var(--fondo-scuro); color: var(--su-scuro);
    padding-block: var(--sp-8); }
  .fascia-lavoro-griglia { display: flex; flex-wrap: wrap; align-items: center;
    justify-content: space-between; gap: var(--sp-6); }
  .fascia-lavoro p { margin-top: var(--sp-3); max-width: 62ch; }
  /* La fascia chiude la pagina appoggiandosi al piede: fra due fondi scuri
     una striscia di crema sarebbe letta come un errore di montaggio. */
  main:has(.fascia-lavoro) + .sito-piede { margin-top: 0; }

  .dati-chiave { display: flex; flex-wrap: wrap; gap: var(--sp-3) var(--sp-6);
    margin-top: var(--sp-4); }
  .dati-chiave dt { font-size: var(--corpo-1); font-weight: 600;
    letter-spacing: var(--spaziatura-lettere-etichetta); text-transform: uppercase;
    color: var(--testo-tenue); }
  .dati-chiave dd { margin: var(--sp-1) 0 0; color: var(--inchiostro); font-weight: 500; }
  .azioni-colonna { display: flex; flex-direction: column; gap: 12px; }
  .bianco { color: var(--su-scuro-forte); margin-top: var(--sp-2); }
  .chiara { color: var(--su-scuro-tenue); }

  /* ---------------- piè di pagina ---------------- */
  .sito-piede { background: var(--piede-fondo); color: var(--su-piede); margin-top: var(--sp-9);
    padding-block: var(--sp-7) var(--sp-5); font-size: var(--corpo-1); }
  .piede-alto { display: grid; grid-template-columns: minmax(0, 1.3fr) repeat(3, minmax(0, 1fr));
    gap: var(--sp-6); padding-bottom: var(--sp-6); border-bottom: 1px solid var(--bordo-su-scuro); }
  .marchio-bianco { height: 64px; width: 67px; display: block; }
  .piede-nome { margin-top: 16px; }
  .piede-nome strong { color: var(--su-scuro-forte); font-size: var(--corpo-2); }
  .piede-recapiti { margin-top: var(--sp-3); color: var(--su-piede-recapiti); }
  .piede-colonna h2 { font-family: var(--font-testo); font-size: var(--corpo-1); font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--su-piede-tenue); margin-bottom: var(--sp-3); }
  .piede-colonna ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  /* Il piè di pagina aveva quarantadue voci scritte come <span>: sembrava
     una mappa del sito e non ne portava da nessuna parte. */
  .piede-colonna a { color: var(--su-scuro); text-decoration: none;
    display: inline-block; padding-block: var(--sp-1); }
  .piede-colonna a:hover { color: var(--su-scuro-forte); text-decoration: underline;
    text-underline-offset: 0.2em; }
  .piede-basso { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px;
    padding-top: var(--sp-5); color: var(--su-piede-tenue); }
  .piede-legali { display: flex; flex-wrap: wrap; gap: var(--sp-2) var(--sp-4); }
  .piede-legali a { color: var(--su-piede-tenue); text-decoration: none; }
  .piede-legali a:hover { color: var(--su-scuro-forte); text-decoration: underline; }

  /* ---------------- pagine interne ---------------- */
  /* Le briciole: un elenco ordinato dentro una navigazione, non una fila di
     parole. Il separatore è decorativo e non va letto ad alta voce. */
  .briciole { padding-top: 16px; font-size: var(--corpo-1); color: var(--testo-tenue); }
  .briciole ol { list-style: none; display: flex; flex-wrap: wrap;
    align-items: center; gap: var(--sp-1) var(--sp-2); }
  .briciole li { display: inline-flex; align-items: center; gap: var(--sp-2); }
  .briciole li + li::before { content: "›"; color: var(--bordo-controllo); }
  .briciole a { color: var(--testo-secondario); text-decoration: none; }
  .briciole a:hover { color: var(--primario); text-decoration: underline;
    text-underline-offset: 0.2em; }
  .briciole [aria-current="page"] { color: var(--testo-tenue); }
  .apertura { padding-top: 24px; }
  .occhiello-testo { font-size: var(--corpo-3); color: var(--testo-secondario); margin-top: 16px; }
  .dati { margin-top: 12px; color: var(--testo-secondario); max-width: none; }
  .riga-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
  .apertura h1 { margin-top: 12px; }
  .disponibilita { font-size: var(--corpo-1); color: var(--testo-secondario); font-weight: 600; }
  .disponibilita em { font-style: normal; font-weight: 400; color: var(--testo-tenue); }

  .sicurezza { margin-top: var(--sp-5); background: var(--allarme-fondo);
    border-left: 4px solid var(--allarme-testo); border-radius: var(--raggio);
    padding: var(--sp-4) var(--sp-5); display: flex; flex-wrap: wrap;
    align-items: center; justify-content: space-between; gap: var(--sp-3) var(--sp-5); }
  .sic-corpo { display: flex; flex-wrap: wrap; align-items: baseline;
    gap: var(--sp-2) var(--sp-5); flex: 1; }
  .sic-titolo { font-family: var(--font-display); font-size: var(--corpo-3); font-weight: 600;
    color: var(--allarme-testo); }
  .sicurezza ul { list-style: none; display: flex; flex-wrap: wrap; gap: var(--sp-1) var(--sp-5);
    color: var(--allarme-testo); font-size: var(--corpo-1); }
  .sicurezza li { display: inline-flex; align-items: baseline; gap: var(--sp-2); }
  .sic-numero { font-family: var(--font-display); font-size: var(--corpo-3); font-weight: 700;
    color: var(--allarme-testo); text-decoration: none; }
  .sic-numero:hover { text-decoration: underline; text-underline-offset: 0.2em; }
  .sic-avviso { flex-basis: 100%; font-size: var(--corpo-1); color: var(--allarme-testo); }
  .sic-esci { background: var(--allarme-testo); color: var(--superficie);
    border: 0; border-radius: var(--raggio); padding: var(--sp-3) var(--sp-5);
    min-height: 44px; font: inherit; font-size: var(--corpo-1); font-weight: 600;
    cursor: pointer; white-space: nowrap; }

  /* I tre passi erano tre riquadri bianchi con bordo e angoli tondi, e
     dentro ciascuno una fila di pastiglie con a loro volta bordo e angoli
     tondi: scatole dentro scatole. Il gruppo lo segnala la domanda, non
     una cornice. */
  .filtro { margin-top: 32px; display: flex; flex-direction: column; gap: var(--sp-6);
    max-width: 62rem; }
  fieldset { border: 0; border-top: 1px solid var(--bordo); padding: var(--sp-4) 0 0;
    margin: 0; background: transparent; }
  legend { font-family: var(--font-display); font-size: var(--corpo-4); font-weight: 600;
    color: var(--inchiostro); padding: 0; }
  .opzioni { display: flex; flex-wrap: wrap; gap: 8px; margin-top: var(--sp-4); }
  .opzione { border: 1px solid var(--bordo-opzione); border-radius: 999px; padding: 8px 16px;
    font-size: var(--corpo-1); color: var(--testo); background: var(--superficie); }
  .risultati { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
  .risultato { background: var(--superficie); border: 1px solid var(--bordo); border-radius: var(--raggio);
    border-left: 4px solid var(--filetto); padding: 16px 24px; display: flex; flex-wrap: wrap;
    align-items: center; justify-content: space-between; gap: 12px; }
  .risultato p { font-size: var(--corpo-1); color: var(--testo-secondario); margin-top: 4px; }

  .impaginato { display: grid; grid-template-columns: minmax(0,1fr) 330px; gap: 48px;
    align-items: start; margin-top: 48px; }
  section + section { margin-top: var(--sp-7); }
  section h2 { margin-bottom: 16px; }
  section p + p { margin-top: 12px; }
  .non-e { border-left: 3px solid var(--filetto); padding-left: 16px; color: var(--testo-secondario); }
  .premessa { margin-bottom: var(--sp-5); color: var(--testo-secondario); }
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
  .passi { list-style: none; display: flex; flex-direction: column; gap: var(--sp-4);
    counter-reset: passo; }
  .passi li { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 16px; align-items: start; }
  /* Prima erano quattro dischi lilla vuoti: il componente era disegnato per
     contenere un numerale e il numerale non c'era. */
  .numero { width: 44px; height: 44px; border-radius: var(--raggio-pieno);
    background: var(--primario-chiaro); border: 1px solid var(--primario-bordo);
    color: var(--primario-scuro);
    font-family: var(--font-display); font-size: var(--corpo-4); font-weight: 700;
    display: grid; place-items: center; font-variant-numeric: tabular-nums; }
  .numero::before { counter-increment: passo; content: counter(passo); }
  .passi p { color: var(--testo-secondario); margin-top: 4px; }
  .referente { display: flex; gap: 16px; align-items: center; background: var(--superficie);
    border: 1px solid var(--bordo); border-radius: var(--raggio); padding: 16px; }
  .ritratto { width: 76px; height: 76px; border-radius: var(--raggio-pieno);
    background: var(--superficie-alt); border: 1px dashed var(--bordo-controllo);
    display: grid; place-items: center; font-size: var(--corpo-1); color: var(--testo-tenue);
    flex: none; }
  .nome { font-family: var(--font-display); font-size: var(--corpo-4); font-weight: 600; color: var(--inchiostro); }
  .ruolo { font-size: var(--corpo-1); color: var(--testo-tenue); }
  .atti { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 8px 16px; font-size: var(--corpo-1); }
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
  .avviso-accesso h2, .avviso-accesso p { color: var(--attenzione-testo); }

  .impegni { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
    gap: 16px; margin-top: 24px; }
  .impegni li { background: var(--superficie); border: 1px solid var(--bordo);
    border-radius: var(--raggio); padding: 24px; display: flex; flex-direction: column; gap: 4px; }
  .impegni strong { font-family: var(--font-display); font-size: var(--corpo-5); color: var(--primario); }
  .impegni span { font-size: var(--corpo-1); color: var(--testo-secondario); }
  .scroll { overflow-x: auto; margin-top: 16px; }
  table { border-collapse: collapse; width: 100%; font-size: var(--corpo-1); background: var(--superficie); }
  th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--bordo); }
  th { font-weight: 600; color: var(--inchiostro); }
  .referenti { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px,1fr));
    gap: 12px; margin-top: 24px; }
  .referenti li { background: var(--superficie); border: 1px solid var(--bordo);
    border-radius: var(--raggio); padding: 16px; display: flex; flex-direction: column; gap: 4px; }
  .mono { font-variant-numeric: tabular-nums; color: var(--primario); font-weight: 600; }

  .retribuzione { margin-top: 24px; background: var(--anziani-fondo); border-radius: var(--raggio);
    padding: 24px 32px; display: flex; flex-direction: column; gap: 4px; }
  .cifra { font-family: var(--font-display); font-size: var(--corpo-6); font-weight: 700;
    color: var(--anziani-testo); line-height: 1.1; letter-spacing: -0.03em; }
  .retribuzione p { color: var(--anziani-testo); }
  .campo { display: flex; flex-direction: column; gap: 8px; }
  .campo label { font-weight: 600; color: var(--inchiostro); font-size: var(--corpo-2); }
  .campo label span { font-weight: 400; font-size: var(--corpo-1); color: var(--testo-tenue); }
  .campo input { min-height: 52px; padding: 12px 16px; border: 1px solid var(--bordo-controllo);
    border-radius: var(--raggio); background: var(--superficie); font: inherit; color: inherit; }

${CSS_NUOVE}

  /* Prima esisteva un solo punto di rottura, a 62rem, e sotto quello la
     navigazione spariva senza sostituto. Adesso i livelli sono tre. */
  @media (max-width: 62rem) {
    .ingresso-griglia, .impaginato, .riquadro-costi { grid-template-columns: 1fr; gap: var(--sp-6); }
    .piede-alto { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
    .riga-testata nav { order: 3; flex-basis: 100%; }
  }
  .telaio.telefono :is(.ingresso-griglia, .impaginato, .riquadro-costi, .porte, .griglia-settori,
    .impegni, .referenti, .piede-alto, .promesse, .valori, .professioni, .due-riquadri,
    .tipologie, .guide, .documenti, .modulo-griglia) { grid-template-columns: 1fr; }
  .telaio.telefono .sedi-elenco li { grid-template-columns: 88px minmax(0,1fr); }
  .telaio.telefono .sedi-elenco .collegamento { grid-column: 1 / -1; }
  .telaio.telefono .fascia-citazione p { font-size: var(--corpo-4); }
  .telaio.telefono .fascia-numeri dl { grid-template-columns: 1fr 1fr; gap: 24px; }
  /* Sul telefono la navigazione non sparisce: diventa un pulsante di 48 px,
     e la ricerca resta. Prima erano nascoste e basta. */
  .telaio.telefono .riga-testata nav { display: none; }
  .telaio.telefono .menu-telefono { display: inline-flex; }
  .telaio.telefono .ricerca { padding: var(--sp-2) var(--sp-3); }
  .telaio.telefono .ricerca span:last-child { display: none; }
  .telaio.telefono .capacita { display: block; }
  .telaio.telefono .capacita thead { display: none; }
  .telaio.telefono .capacita tr { display: block; padding-block: var(--sp-3);
    border-bottom: 1px solid var(--bordo); }
  .telaio.telefono .capacita th, .telaio.telefono .capacita td {
    display: block; border: 0; padding: var(--sp-1) 0; }
  .telaio.telefono .ingresso h1 { font-size: var(--corpo-6); }
  .telaio.telefono .fascia-numeri dt { font-size: var(--corpo-6); }
  /* Sul telefono la barra di servizio andava a capo tre volte e mangiava
     ottanta pixel sopra il titolo di ogni pagina. Il claim è la parte che
     non serve a nessuno lì: restano il numero e l'area soci. */
  .telaio.telefono .riga-servizio > span:first-child { display: none; }
  .telaio.telefono .costo-griglia, .telaio.telefono .guida-griglia,
  .telaio.telefono .guida-testa { grid-template-columns: 1fr; }
  .telaio.telefono .guida-indice { position: static; }
  .telaio.telefono .sic-esci { width: 100%; }
  .telaio.telefono .invia { width: 100%; }

  @media (max-width: 40rem) {
    .riga-servizio > span:first-child { display: none; }
    .guida-testa { grid-template-columns: 1fr; }
    .sic-esci, .invia { width: 100%; }
  }
</style>

${SIMBOLI}

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
