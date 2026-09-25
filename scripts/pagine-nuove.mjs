/**
 * Le sette schermate che mancavano, per l'anteprima.
 *
 * Nella prima versione due delle quattro porte della home non portavano da
 * nessuna parte, e mancavano i tipi di pagina che reggono il traffico vero:
 * la pagina di settore, quella di territorio e una guida permanente.
 */
import { testata, piede, briciole, icona, e } from './pezzi.mjs';
import { LAVORO, ENTI, CHI_SIAMO, SETTORE, TERRITORIO, GUIDA, RICHIAMATA } from '../src/content/pagine.js';

/* ==================================================== LAVORA CON NOI ==== */
export const P_LAVORO = `
${testata('Lavora con noi')}
${briciole(['Home', 'Lavora con noi'])}
<header class="guscio apertura editoriale">
  <p class="etichetta">${e(LAVORO.occhiello)}</p>
  <h1>${e(LAVORO.titolo)}</h1>
  <p class="occhiello-testo">${e(LAVORO.intro)}</p>
  <div class="azioni-riga">
    <span class="azione a-primario">Vedi le [N] posizioni aperte</span>
    <span class="azione a-secondario">Candidatura spontanea</span>
  </div>
</header>

<section class="guscio sez">
  <h2>Quattro cose che mettiamo per iscritto</h2>
  <ul class="promesse">
    ${LAVORO.promesse.map(([t, d], i) => `
    <li><span class="indice numeri" aria-hidden="true">${i + 1}</span>
      <div><h3>${e(t)}</h3><p>${e(d)}</p></div></li>`).join('')}
  </ul>
</section>

<section class="fascia-citazione">
  <div class="guscio">
    <blockquote>
      <p>${e(LAVORO.voce.testo)}</p>
      <footer>${e(LAVORO.voce.autore)}</footer>
    </blockquote>
  </div>
</section>

<section class="guscio sez">
  <div class="titolo-doppio">
    <h2>Le professioni</h2>
    <p>che cosa si fa davvero, da noi</p>
  </div>
  <ul class="professioni">
    ${LAVORO.professioni.map(([sigla, nome, set, testo]) => `
    <li class="professione s-${set}">
      <span class="sigla">${e(sigla)}</span>
      <div><h3>${e(nome)}</h3><p>${e(testo)}</p>
      <span class="collegamento">Come si lavora qui <span aria-hidden="true">→</span></span></div>
    </li>`).join('')}
  </ul>
</section>

<section class="guscio sez">
  <div class="due-riquadri">
    <div class="riquadro quieto">
      <h2>${e(LAVORO.percorsi.titolo)}</h2>
      <p>${e(LAVORO.percorsi.testo)}</p>
      <span class="collegamento">Percorsi di ingresso <span aria-hidden="true">→</span></span>
    </div>
    <div class="riquadro quieto">
      <h2>${e(LAVORO.amico.titolo)}</h2>
      <p>${e(LAVORO.amico.testo)}</p>
      <span class="collegamento">Segnala una persona <span aria-hidden="true">→</span></span>
    </div>
  </div>
</section>
${piede}`;

/* ===================================================== ENTI E IMPRESE === */
export const P_ENTI = `
${testata('Per enti e imprese')}
${briciole(['Home', 'Per enti e imprese'])}
<header class="guscio apertura editoriale">
  <p class="etichetta">${e(ENTI.occhiello)}</p>
  <h1>${e(ENTI.titolo)}</h1>
  <p class="occhiello-testo">${e(ENTI.intro)}</p>
</header>

<section class="guscio sez">
  <div class="titolo-doppio">
    <h2>Che cosa sappiamo gestire</h2>
    <p>dati dal gestionale, mai digitati a mano</p>
  </div>
  <div class="scroll">
    <table class="capacita">
      <thead><tr>
        <th scope="col">Settore</th><th scope="col">Presenza</th><th scope="col">Tipologie</th>
      </tr></thead>
      <tbody>
        ${ENTI.capacita.map(([cod, nome, pres, tip]) => `
        <tr class="s-${cod}">
          <th scope="row"><span class="punto" aria-hidden="true"></span>${e(nome)}</th>
          <td class="numeri">${e(pres)}</td>
          <td>${e(tip)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</section>

<section class="guscio sez">
  <div class="due-riquadri">
    <div class="riquadro quieto">
      <h2>${e(ENTI.atti.titolo)}</h2>
      <p>${e(ENTI.atti.testo)}</p>
      <span class="collegamento">Consulta gli atti <span aria-hidden="true">→</span></span>
    </div>
    <div class="riquadro quieto in-programma">
      <h2>${e(ENTI.esiti.titolo)}</h2>
      <p>${e(ENTI.esiti.testo)}</p>
      <p class="stato-lavori">${e(ENTI.esiti.stato)}</p>
    </div>
  </div>
</section>

<section class="guscio sez">
  <div class="riquadro referente-gare">
    <div>
      <h2 class="etichetta">${e(ENTI.referente.titolo)}</h2>
      <p class="nome">${e(ENTI.referente.nome)}</p>
      <p class="ruolo">${e(ENTI.referente.ruolo)} · ${e(ENTI.referente.contatti)}</p>
      <p class="impegno-gare">${e(ENTI.referente.impegno)}</p>
    </div>
    <span class="azione a-primario">Scrivi al referente</span>
  </div>
</section>

<section class="guscio sez">
  <h2>Documenti</h2>
  <ul class="documenti">
    ${ENTI.documenti.map((d) => `<li>${icona('cartella', 'piccola')}<span>${e(d)}</span></li>`).join('')}
  </ul>
</section>
${piede}`;

/* ========================================================= CHI SIAMO ==== */
export const P_CHI_SIAMO = `
${testata('Chi siamo')}
${briciole(['Home', 'Chi siamo'])}
<header class="guscio apertura editoriale">
  <p class="etichetta">${e(CHI_SIAMO.occhiello)}</p>
  <h1>${e(CHI_SIAMO.titolo)}</h1>
  <p class="occhiello-testo">${e(CHI_SIAMO.intro)}</p>
</header>

<section class="fascia-numeri stretta">
  <div class="guscio">
    <dl>${CHI_SIAMO.numeri.map(([n, d]) => `<div><dt class="numeri">${e(n)}</dt><dd>${e(d)}</dd></div>`).join('')}</dl>
  </div>
</section>

<div class="guscio impaginato">
  <div>
    <section><h2>${e(CHI_SIAMO.storia.titolo)}</h2>
      <div class="posa testo"><span class="etichetta">${e(CHI_SIAMO.storia.testo)}</span></div></section>
    <section><h2>${e(CHI_SIAMO.governance.titolo)}</h2><p>${e(CHI_SIAMO.governance.testo)}</p></section>
    <section>
      <h2>A che cosa teniamo</h2>
      <ul class="valori">
        ${CHI_SIAMO.valori.map(([t, d]) => `<li><h3>${e(t)}</h3><p>${e(d)}</p></li>`).join('')}
      </ul>
    </section>
  </div>
  <aside class="lato">
    <div class="riquadro quieto"><h2>Documenti</h2>
      <ul class="elenco-semplice">
        <li>Bilancio sociale</li><li>Amministrazione trasparente</li>
        <li>Certificazioni e modello 231</li><li>Whistleblowing</li>
      </ul></div>
    <div class="riquadro"><h2>Diventare socio</h2>
      <p>Cosa comporta, cosa si versa, cosa si ottiene, quando si può. Spiegato prima.</p>
      <span class="azione a-secondario largo">Leggi come funziona</span></div>
  </aside>
</div>
${piede}`;

/* =================================================== PAGINA SETTORE ===== */
export const P_SETTORE = `
${testata('I servizi')}
${briciole(['Home', 'I servizi', SETTORE.nome])}
<header class="guscio apertura editoriale s-${SETTORE.codice}">
  <p class="etichetta tinta">${e(SETTORE.occhiello)} · ${e(SETTORE.nome)}</p>
  <h1>${e(SETTORE.titolo)}</h1>
  <p class="occhiello-testo">${e(SETTORE.intro)}</p>
</header>

<section class="guscio sez">
  <div class="riquadro domanda s-${SETTORE.codice}">
    <h2>${e(SETTORE.domanda.titolo)}</h2>
    <p>${e(SETTORE.domanda.testo)}</p>
  </div>
</section>

<section class="guscio sez">
  <h2>Le cinque cose diverse che chiamiamo «anziani»</h2>
  <ul class="tipologie s-${SETTORE.codice}">
    ${SETTORE.tipologie.map(([nome, testo, n]) => `
    <li><div class="tip-testa"><h3>${e(nome)}</h3><span class="pillola">${e(n)}</span></div>
      <p>${e(testo)}</p>
      <span class="collegamento">Vedi le sedi <span aria-hidden="true">→</span></span></li>`).join('')}
  </ul>
</section>

<section class="guscio sez">
  <div class="titolo-doppio"><h2>Dove siamo</h2><p>scegli la provincia</p></div>
  <ul class="province">
    ${SETTORE.province.map((p) => `<li><span class="opzione">${e(p)}</span></li>`).join('')}
  </ul>
</section>

<section class="guscio sez">
  <div class="titolo-doppio"><h2>Prima di cercare un posto</h2><p>tre guide che tolgono tempo perso</p></div>
  <ul class="guide">
    ${SETTORE.guide.map(([t, d]) => `<li><h3>${e(t)}</h3><p>${e(d)}</p>
      <span class="collegamento">Leggi <span aria-hidden="true">→</span></span></li>`).join('')}
  </ul>
</section>
${piede}`;

/* ================================================ PAGINA TERRITORIO ===== */
export const P_TERRITORIO = `
${testata('I servizi')}
${briciole(['Home', 'I servizi', 'Anziani', TERRITORIO.provincia])}
<header class="guscio apertura editoriale s-${TERRITORIO.settore}">
  <p class="etichetta tinta">${e(TERRITORIO.occhiello)}</p>
  <h1>${e(TERRITORIO.titolo)}</h1>
  <p class="occhiello-testo">${e(TERRITORIO.intro)}</p>
</header>

<section class="guscio sez">
  <!-- La classe di settore va su questo blocco, non solo sulla testata:
       --filetto vive lì, e senza il filetto restava senza colore. -->
  <div class="riquadro quieto locale s-${TERRITORIO.settore}">
    <p class="etichetta">Come funziona qui</p>
    <p>${e(TERRITORIO.locale)}</p>
  </div>
</section>

<section class="guscio sez">
  <div class="titolo-doppio"><h2>Le sedi</h2><p>disponibilità dal gestionale, con la data</p></div>
  <ul class="sedi-elenco s-${TERRITORIO.settore}">
    ${TERRITORIO.sedi.map(([nome, tipo, posti, stato, cls]) => `
    <li>
      <div class="sede-posa" aria-hidden="true"><span>[FOTO]</span></div>
      <div class="sede-corpo">
        <h3>${e(nome)}</h3>
        <p class="sede-tipo">${e(tipo)} · <span class="numeri">${e(posti)}</span></p>
        <span class="stato ${cls}">${e(stato)}</span>
      </div>
      <span class="collegamento">Vedi la scheda <span aria-hidden="true">→</span></span>
    </li>`).join('')}
  </ul>
</section>

<section class="guscio sez">
  <div class="titolo-doppio"><h2>Province vicine</h2><p>se cerchi anche fuori Torino</p></div>
  <ul class="province">
    ${TERRITORIO.vicino.map((p) => `<li><span class="opzione">${e(p)}</span></li>`).join('')}
  </ul>
</section>
${piede}`;

/* ============================================================ GUIDA ===== */
/**
 * La guida aveva una colonna di testo centrata in una pagina larga: le
 * briciole partivano dal bordo sinistro, il testo duecento pixel più in
 * dentro, e i due lati restavano vuoti. Sembrava una pagina non finita.
 *
 * Il vuoto adesso lo occupa la cosa che a una guida in cinque passi serve
 * davvero: l'indice, che sta fermo mentre si scorre e dice a che punto si
 * è. È una colonna con una funzione, non un riempimento.
 */
export const P_GUIDA = `
${testata('I servizi')}
${briciole(['Home', 'Guide', GUIDA.titolo], ['#', '#'])}
<article class="guida">
  <header class="guscio guida-testa">
    <div>
      <p class="etichetta">${e(GUIDA.occhiello)}</p>
      <h1>${e(GUIDA.titolo)}</h1>
    </div>
    <div class="guida-testa-lato">
      <p class="sommario">${e(GUIDA.sommario)}</p>
      <p class="revisione">${e(GUIDA.aggiornata)}</p>
    </div>
  </header>

  <div class="guscio guida-griglia">
    <nav class="guida-indice" aria-label="I passi di questa guida">
      <h2>In questa guida</h2>
      <ol>
        ${GUIDA.passi.map(([t], i) => `<li><a href="#passo-${i + 1}">${e(t)}</a></li>`).join('')}
        <li><a href="#errori-guida">${e(GUIDA.errori.titolo)}</a></li>
      </ol>
    </nav>

    <div class="corpo-guida">
      <ol class="passi-guida">
        ${GUIDA.passi.map(([t, d], i) => `
        <li id="passo-${i + 1}"><span class="indice numeri" aria-hidden="true">${i + 1}</span>
          <div><h2>${e(t)}</h2><p>${e(d)}</p></div></li>`).join('')}
      </ol>

      <section class="errori" id="errori-guida">
        <h2>${e(GUIDA.errori.titolo)}</h2>
        <ul>${GUIDA.errori.voci.map((v) => `<li>${e(v)}</li>`).join('')}</ul>
      </section>

      <div class="riquadro chiusura-guida">
        <h2>Vuoi parlarne con una persona?</h2>
        <p>Ti richiamiamo entro un giorno lavorativo, anche solo per capire se serve davvero una RSA.</p>
        <a class="azione a-primario" href="#">Fatti richiamare</a>
      </div>
    </div>
  </div>
</article>
${piede}`;

/* ======================================================= RICHIAMATA ===== */
export const P_RICHIAMATA = `
${testata('')}
${briciole(['Home', 'Ti richiamiamo noi'])}
<div class="guscio modulo-griglia">
  <div>
    <p class="etichetta">${e(RICHIAMATA.occhiello)}</p>
    <h1>${e(RICHIAMATA.titolo)}</h1>
    <p class="occhiello-testo">${e(RICHIAMATA.intro)}</p>

    <!-- Il modulo era un disegno di modulo: le fasce orarie erano <span>,
         il consenso una casella finta fatta con un bordo, e il pulsante un
         altro <span>. Con il consenso disegnato invece che raccolto, il
         trattamento dei dati non era né esprimibile né dimostrabile: il
         punto per cui esiste quella riga. Qui i controlli sono veri. -->
    <form class="modulo" method="post" action="/richiamata" onsubmit="return false">
      <div class="campo"><label for="m-nome">Il tuo nome <span>(obbligatorio)</span></label>
        <p class="aiuto" id="m-nome-aiuto">Serve solo per sapere come chiamarti.</p>
        <input id="m-nome" name="nome" type="text" autocomplete="name"
          required aria-required="true" aria-describedby="m-nome-aiuto"></div>
      <div class="campo"><label for="m-tel">Telefono <span>(obbligatorio)</span></label>
        <input id="m-tel" name="telefono" type="tel" autocomplete="tel" inputmode="tel"
          required aria-required="true"></div>
      <fieldset class="campo">
        <legend>Quando ti fa comodo <span>(facoltativo)</span></legend>
        <!-- Nessuna opzione preselezionata: una fascia scelta al posto di
             chi legge è un dato che non ci ha dato. -->
        <div class="opzioni">${RICHIAMATA.fasce
          .map(
            (f) => `<label class="opzione"><input type="radio" name="fascia"
              value="${e(f.toLowerCase())}"><span>${e(f)}</span></label>`,
          )
          .join('')}</div>
      </fieldset>
      <div class="campo"><label for="m-bisogno">Di che cosa avresti bisogno <span>(facoltativo)</span></label>
        <p class="aiuto" id="m-bisogno-aiuto">Anche due righe. Al nome tecnico ci pensiamo noi.</p>
        <textarea id="m-bisogno" name="bisogno" rows="4" aria-describedby="m-bisogno-aiuto"></textarea></div>
      <div class="campo"><label class="consenso" for="m-consenso">
        <input id="m-consenso" name="consenso" type="checkbox" value="si" required aria-required="true">
        <span>${e(RICHIAMATA.consenso)} <span class="obbligo">(obbligatorio)</span></span></label></div>
      <button type="submit" class="azione a-primario largo">Richiamami</button>
    </form>
  </div>

  <aside class="lato">
    <div class="riquadro quieto privacy">
      <p class="etichetta">Che cosa succede ai tuoi dati</p>
      <p>${e(RICHIAMATA.nota)}</p>
    </div>
    <div class="riquadro">
      <h2>${e(RICHIAMATA.alternativa.titolo)}</h2>
      <p>${e(RICHIAMATA.alternativa.testo)}</p>
    </div>
  </aside>
</div>
${piede}`;

/* Lo stile che serve solo a queste pagine. */
export const CSS_NUOVE = `
  .editoriale { padding-top: 40px; padding-bottom: 8px; }
  .editoriale h1 { margin-top: 12px; max-width: 20ch; }
  .editoriale .occhiello-testo { max-width: 62ch; }
  .tinta { color: var(--tinta); }
  .azioni-riga { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
  .testo-stretto { max-width: 760px; margin-inline: auto; }

  .promesse { list-style: none; display: grid;
    grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px 48px; margin-top: 24px; }
  /* Tre valori in una griglia a due colonne lasciavano un orfano nella
     seconda riga, e tre scatole in più su una pagina che ne aveva già
     otto. In colonna sono tre affermazioni in fila, che è quello che
     sono. */
  .valori { list-style: none; display: flex; flex-direction: column;
    gap: var(--sp-5); margin-top: 24px; }
  .promesse li { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 16px; align-items: start; }
  .indice { width: 40px; height: 40px; border-radius: 999px; background: var(--primario-chiaro);
    color: var(--primario); font-family: var(--font-display); font-weight: 700;
    font-size: var(--corpo-3); display: grid; place-items: center; flex: none; }
  .promesse p, .valori p { font-size: var(--corpo-1); color: var(--testo-secondario); margin-top: 4px; }
  .valori li { border-left: 4px solid var(--primario); padding-left: var(--sp-5); }
  .valori h3 { font-size: var(--corpo-4); }
  .valori p { font-size: var(--corpo-2); color: var(--testo-secondario); margin-top: var(--sp-2); }

  .fascia-citazione { background: var(--superficie); border-block: 1px solid var(--bordo);
    padding-block: 56px; margin-top: 64px; }
  .fascia-citazione blockquote { margin: 0; max-width: 46ch; }
  .fascia-citazione p { font-family: var(--font-display); font-size: var(--corpo-5);
    font-weight: 500; line-height: 1.28; color: var(--inchiostro); letter-spacing: -0.014em; }
  .fascia-citazione footer { margin-top: 16px; font-size: var(--corpo-1); color: var(--testo-tenue); }

  .professioni { list-style: none; display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-top: 24px; }
  .professione { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 16px;
    background: var(--superficie); border-radius: var(--raggio); padding: 24px;
    border-top: 3px solid var(--filetto); }
  /* Le sigle sono lunghe da due a cinque lettere: senza una larghezza
     minima comune, «OSS», «IP» e «COORD» spostavano il titolo di ogni
     scheda di qualche pixel e la griglia non aveva una colonna. */
  .sigla { font-family: var(--font-display); font-weight: 700; font-size: var(--corpo-1);
    letter-spacing: 0.04em; color: var(--tinta); background: var(--velo);
    border-radius: var(--raggio-pieno); padding: 6px 12px; height: fit-content;
    min-width: 5rem; text-align: center; }
  /* La scheda è alta quanto la più alta della riga; se il collegamento non
     è ancorato in fondo, i «Come si lavora qui →» finiscono a tre quote
     diverse sulla stessa riga. Vale per tutte le griglie di schede. */
  .professione > div { display: flex; flex-direction: column; height: 100%; }
  .professione p { font-size: var(--corpo-1); color: var(--testo-secondario); margin-top: 4px;
    flex: 1; }
  .professione .collegamento { display: inline-block; margin-top: 12px; align-self: flex-start; }

  .due-riquadri { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
  .due-riquadri .riquadro p { flex: 1; }
  .due-riquadri .collegamento { align-self: flex-start; }
  .in-programma { border-style: dashed; }
  .stato-lavori { font-size: var(--corpo-1); color: var(--attenzione-testo) !important;
    background: var(--attenzione-fondo); border-radius: var(--raggio); padding: 8px 16px; }

  .capacita th[scope="row"] { font-family: var(--font-display); font-size: var(--corpo-3);
    white-space: nowrap; }
  .punto { display: inline-block; width: 10px; height: 10px; border-radius: 999px;
    background: var(--filetto); margin-right: 12px; }
  .capacita td { color: var(--testo-secondario); }

  /* Il riquadro eredita «flex-direction: column» da .riquadro. Senza
     rimetterla a «row», «align-items: center» centrava il testo invece di
     allinearlo: il blocco del referente gare — la cosa che una commissione
     cerca per prima — stava in mezzo alla pagina come una dedica. */
  .referente-gare { display: flex; flex-direction: row; flex-wrap: wrap;
    align-items: center; justify-content: space-between; gap: 24px; text-align: left; }
  /* .riquadro h2 (0,1,1) batteva .etichetta (0,1,0): l'occhiello del
     referente veniva fuori grande come un titolo di sezione. */
  .referente-gare h2.etichetta { font-family: var(--font-testo); font-size: var(--corpo-1);
    font-weight: 600; letter-spacing: var(--spaziatura-lettere-etichetta);
    text-transform: uppercase; color: var(--testo-tenue); }
  .referente-gare .nome { margin-top: var(--sp-2); }
  .impegno-gare { color: var(--primario-scuro) !important; font-weight: 600; margin-top: 8px; }

  .documenti { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
    gap: 12px; margin-top: 24px; }
  .documenti li { display: flex; align-items: center; gap: 12px; background: var(--superficie);
    border-radius: var(--raggio); padding: 16px 20px; color: var(--testo-secondario);
    font-size: var(--corpo-1); }
  .documenti .icona { color: var(--primario); flex: none; }

  .fascia-numeri.stretta { padding-block: 32px; margin-top: 32px; }
  .fascia-numeri.stretta dt { font-size: var(--corpo-6); }
  .posa.testo { aspect-ratio: auto; min-height: 180px; }
  .elenco-semplice { list-style: none; display: flex; flex-direction: column; gap: 8px;
    font-size: var(--corpo-1); color: var(--primario); font-weight: 500; }

  .domanda { background: var(--velo, var(--primario-chiaro)); border-color: transparent; }
  .domanda h2 { margin-bottom: 12px; }
  .tipologie { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(290px,1fr));
    gap: 16px; margin-top: 24px; }
  .tipologie li { background: var(--superficie); border-radius: var(--raggio); padding: 24px;
    border-top: 3px solid var(--filetto); display: flex; flex-direction: column; gap: 8px; }
  .tip-testa { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .tipologie p { font-size: var(--corpo-1); color: var(--testo-secondario); flex: 1; }
  .tipologie .collegamento, .guide .collegamento { align-self: flex-start; margin-top: auto;
    padding-top: var(--sp-2); }
  .province { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
  .guide { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr));
    gap: 16px; margin-top: 24px; }
  .guide li { background: var(--superficie); border-radius: var(--raggio); padding: 24px;
    display: flex; flex-direction: column; gap: 8px; }
  .guide p { font-size: var(--corpo-1); color: var(--testo-secondario); flex: 1; }

  /* Anche qui il tratteggio era fuori posto: «come funziona qui» è il
     testo che distingue una provincia dall'altra, non un segnaposto. Il
     filetto prende la tinta del settore, che è l'unica cosa che il colore
     ha il permesso di dire. */
  .locale { border-color: var(--bordo); border-left: 4px solid var(--filetto); }
  .sedi-elenco { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
  .sedi-elenco li { display: grid; grid-template-columns: 132px minmax(0,1fr) auto; gap: 24px;
    align-items: center; background: var(--superficie); border-radius: var(--raggio);
    padding: 16px; border-left: 4px solid var(--filetto); }
  .sede-posa { aspect-ratio: 4/3; border-radius: var(--raggio); background: var(--superficie-alt);
    border: 1px dashed var(--bordo-controllo); display: grid; place-items: center;
    font-size: var(--corpo-1); color: var(--testo-tenue); }
  .sede-corpo { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
  .sede-tipo { font-size: var(--corpo-1); color: var(--testo-secondario); }

  .guida { padding-top: 24px; }
  /* La testata della guida è una testata da giornale: titolo a sinistra,
     sommario e data di revisione nella colonna accanto. Prima il titolo
     stava in una colonna di 34 caratteri e metà della fascia restava
     vuota senza che niente lo giustificasse. */
  .guida-testa { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: var(--sp-4) var(--sp-7); align-items: end; padding-top: var(--sp-4);
    padding-bottom: var(--sp-6); border-bottom: 1px solid var(--bordo); }
  .guida-testa h1 { margin-top: var(--sp-2); font-size: var(--corpo-7); max-width: 16ch; }
  .guida .sommario { font-size: var(--corpo-3); color: var(--testo-secondario); max-width: 46ch; }
  .revisione { font-size: var(--corpo-1); color: var(--testo-tenue); margin-top: var(--sp-4); }
  .guida-griglia { display: grid; grid-template-columns: 240px minmax(0, 68ch);
    gap: var(--sp-7); align-items: start; margin-top: 48px; }
  .guida-indice { position: sticky; top: var(--sp-5); border-left: 2px solid var(--bordo);
    padding-left: var(--sp-4); }
  .guida-indice h2 { font-family: var(--font-testo); font-size: var(--corpo-1); font-weight: 600;
    letter-spacing: var(--spaziatura-lettere-etichetta); text-transform: uppercase;
    color: var(--testo-tenue); margin-bottom: var(--sp-3); }
  .guida-indice ol { list-style: none; counter-reset: voce; display: flex;
    flex-direction: column; gap: var(--sp-1); }
  .guida-indice a { display: block; padding-block: var(--sp-2); font-size: var(--corpo-1);
    color: var(--testo-secondario); text-decoration: none; }
  .guida-indice a:hover { color: var(--primario); text-decoration: underline;
    text-underline-offset: 0.2em; }
  .corpo-guida { min-width: 0; }
  .passi-guida li { scroll-margin-top: var(--sp-5); }
  .passi-guida { list-style: none; display: flex; flex-direction: column; gap: 32px; }
  .passi-guida li { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 20px; align-items: start; }
  .passi-guida h2 { font-size: var(--corpo-4); margin-bottom: 8px; }
  .passi-guida p { color: var(--testo-secondario); }
  /* Era una scatola color sabbia su fondo crema: la differenza fra i due
     fondi era di pochi punti e il richiamo non si vedeva. Un filetto
     spesso a sinistra fa lo stesso lavoro e non aggiunge un'altra scatola
     a una pagina che ne aveva già troppe. */
  .errori { margin-top: 48px; border-left: 4px solid var(--attenzione-testo);
    padding: var(--sp-2) 0 var(--sp-2) var(--sp-5); }
  .errori h2 { color: var(--attenzione-testo); font-size: var(--corpo-4);
    margin-bottom: var(--sp-4); }
  .errori ul { padding-left: 24px; display: flex; flex-direction: column; gap: 12px;
    color: var(--testo); font-size: var(--corpo-2); }
  .chiusura-guida { margin-top: 32px; align-items: flex-start; }

  .modulo-griglia { display: grid; grid-template-columns: minmax(0,1fr) 330px; gap: 48px;
    align-items: start; padding-top: 32px; }
  .modulo { display: flex; flex-direction: column; gap: 24px; margin-top: 32px; max-width: 540px; }
  .modulo .campo { gap: 8px; }
  /* Il <fieldset> ereditava il fondo bianco e il bordo della ricerca: in
     mezzo a campi su fondo crema, il gruppo delle fasce orarie sembrava
     una scheda incollata sopra il modulo. Qui è un gruppo e basta. */
  .modulo fieldset.campo { border: 0; padding: 0; background: transparent; }
  .modulo legend { padding: 0; font-size: var(--corpo-2); font-weight: 600; color: var(--inchiostro);
    letter-spacing: 0; text-transform: none; }
  .modulo legend span, .modulo label span { font-weight: 400; font-size: var(--corpo-1);
    color: var(--testo-tenue); }
  .aiuto { font-size: var(--corpo-1); color: var(--testo-secondario); }
  .modulo textarea { padding: 12px 16px; border: 1px solid var(--bordo-controllo);
    border-radius: var(--raggio); background: var(--superficie); font: inherit; color: inherit;
    resize: vertical; }
  /* Le opzioni sono etichette con dentro un comando vero. L'area toccabile
     è tutta l'etichetta, non il cerchietto di 16 px: il pubblico di queste
     pagine ha spesso settant'anni e il telefono in mano. */
  .opzioni label.opzione { display: inline-flex; align-items: center; gap: var(--sp-2);
    min-height: 44px; cursor: pointer; }
  .opzioni input[type="radio"] { width: 20px; height: 20px; margin: 0;
    accent-color: var(--primario); flex: none; }
  .opzioni label.opzione:has(input:checked) { border-color: var(--primario);
    background: var(--primario-chiaro); color: var(--primario-scuro); font-weight: 600; }
  .opzioni label.opzione:has(:focus-visible) { outline: var(--focus) solid var(--primario);
    outline-offset: var(--focus-scostamento); }

  .consenso { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 12px;
    align-items: start; font-size: var(--corpo-1); color: var(--testo-secondario);
    cursor: pointer; }
  .consenso input[type="checkbox"] { width: 24px; height: 24px; margin: 2px 0 0;
    accent-color: var(--primario); flex: none; }
  .obbligo { color: var(--testo-tenue); }
  /* Il tratteggio, su questo sito, vuol dire «qui manca ancora qualcosa»:
     lo usano i segnaposto delle fotografie e delle mappe. Metterlo attorno
     all'informativa sul trattamento dei dati — che è testo definitivo e
     dovuto — faceva sembrare provvisoria proprio la parte che non lo è. */
  .privacy { border-color: var(--bordo); }

  @media (max-width: 62rem) {
    .modulo-griglia, .guida-griglia, .costo-griglia { grid-template-columns: 1fr; gap: 32px; }
    .guida-indice { position: static; }
    .sedi-elenco li { grid-template-columns: 96px minmax(0,1fr); }
    .sedi-elenco .collegamento { grid-column: 1 / -1; }
  }
`;

export const NUOVE = [
  ['lavoro', 'Lavora con noi', P_LAVORO],
  ['enti', 'Enti e gare', P_ENTI],
  ['chisiamo', 'Chi siamo', P_CHI_SIAMO],
  ['settore', 'Pagina settore', P_SETTORE],
  ['territorio', 'Pagina provincia', P_TERRITORIO],
  ['guida', 'Guida', P_GUIDA],
  ['richiamata', 'Richiamata', P_RICHIAMATA],
];
