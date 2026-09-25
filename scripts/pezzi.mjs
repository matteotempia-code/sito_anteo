/**
 * I pezzi condivisi dell'anteprima: testata, piè di pagina, icone.
 *
 * Sono la versione fedele dei componenti veri (`src/components/Testata.astro`
 * e `Piede.astro`). La prima anteprima ne aveva messo una copia ridotta — una
 * riga di testo al posto della testata, una riga al posto del piè di pagina —
 * e il risultato era molto più povero di quello che c'è nel codice. Qui no.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { CONTATTI, NAVIGAZIONE, PIEDE } from '../src/content/anteo.js';

const qui = dirname(fileURLToPath(import.meta.url));

/**
 * Il marchio entra nel documento UNA volta come <symbol>, e ogni testata o
 * piè di pagina lo richiama con <use>. Incorporarlo come immagine in ogni
 * schermata faceva pesare l'anteprima un megabyte di base64 ripetuto: su un
 * progetto il cui primo criterio di collaudo è il tempo di caricamento,
 * sarebbe stato un controsenso.
 */
const interno = (file) => {
  const testo = readFileSync(resolve(qui, `../public/marchio/${file}`), 'utf8');
  return testo
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .trim();
};

const VISTA = '0 0 318.88 305.38';

/** Va messo una volta sola, in cima al documento. */
export const SIMBOLI = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <symbol id="marchio" viewBox="${VISTA}">${interno('logo-lockup.svg')}</symbol>
  <symbol id="marchio-bianco" viewBox="${VISTA}">${interno('logo-lockup-bianco.svg')}</symbol>
</svg>`;

const usa = (id, cls) =>
  `<svg class="${cls}" viewBox="${VISTA}" role="img" aria-label="Anteo Impresa Sociale"><use href="#${id}"/></svg>`;

export const e = (t) =>
  String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Icone in tratto, disegnate a mano. Niente icon font. */
export const ICONE = {
  cuore: '<path d="M20 30s-9-5.6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.4-9 12-9 12Z"/>',
  cartella:
    '<rect x="10" y="9" width="20" height="24" rx="2"/><path d="M16 9V7h8v2"/><path d="M15 18h10M15 24h7"/>',
  persona:
    '<circle cx="20" cy="15" r="5"/><path d="M11 32a9 9 0 0 1 18 0"/>',
  edificio:
    '<path d="M11 33V11l9-4 9 4v22"/><path d="M17 33v-7h6v7"/><path d="M16 16h2M22 16h2M16 21h2M22 21h2"/>',
  lente: '<circle cx="18" cy="18" r="9"/><path d="M25 25l6 6"/>',
};

export const icona = (nome, cls = '') =>
  `<svg class="icona ${cls}" viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONE[nome]}</svg>`;

/**
 * La testata, con la barra di servizio, il marchio vero, la ricerca.
 *
 * Il salto al contenuto è la prima cosa che incontra chi naviga da tastiera
 * o con lo schermo parlante: senza, per arrivare al testo della pagina
 * bisogna attraversare ogni volta dodici voci di menu. È un requisito
 * (WCAG 2.4.1), non una cortesia.
 *
 * Il numero verde è un link telefonico: su un sito il cui pubblico chiama
 * più di quanto scriva, un numero che non si può toccare è un numero che
 * va ricopiato a mano.
 */
export const testata = (attiva = '') => `
<a class="salta" href="#contenuto">Vai al contenuto</a>
<div class="barra-servizio">
  <div class="guscio riga-servizio">
    <span>${e(CONTATTI.claim)}</span>
    <span class="servizio-destra">
      <span class="verde">Numero verde
        <a class="numero-verde numeri" href="tel:+39800127996">${e(CONTATTI.numeroVerde)}</a>
        · ${e(CONTATTI.orari)}</span>
      <a class="soci" href="#">Area soci</a>
    </span>
  </div>
</div>
<header class="sito-testata">
  <div class="guscio riga-testata">
    <a class="marchio-collegamento" href="#" aria-label="Anteo Impresa Sociale, pagina iniziale">${usa('marchio', 'marchio')}</a>
    <nav aria-label="Navigazione principale">
      ${NAVIGAZIONE.map(([, v]) => `<a href="#"${v === attiva ? ' class="attiva" aria-current="page"' : ''}>${e(v)}</a>`).join('')}
    </nav>
    <button type="button" class="ricerca">${icona('lente', 'piccola')}<span>Cerca</span></button>
    <button type="button" class="menu-telefono" aria-expanded="false">Menu</button>
  </div>
</header>`;

/** Il piè di pagina: marchio in negativo, recapiti, tre colonne. */
export const piede = `
<footer class="sito-piede">
  <div class="guscio">
    <div class="piede-alto">
      <div class="piede-identita">
        ${usa('marchio-bianco', 'marchio-bianco')}
        <p class="piede-nome"><strong>Anteo Impresa Sociale</strong><br>società cooperativa sociale</p>
        <p class="piede-recapiti">${e(CONTATTI.indirizzo)}<br>
          <span class="numeri">${e(CONTATTI.telefono)}</span> · ${e(CONTATTI.email)}</p>
      </div>
      ${PIEDE.map((c) => `
      <nav class="piede-colonna" aria-label="${e(c.titolo)}">
        <h2>${e(c.titolo)}</h2>
        <ul>${c.voci.map((v) => `<li><a href="#">${e(v)}</a></li>`).join('')}</ul>
      </nav>`).join('')}
    </div>
    <div class="piede-basso">
      <span>© ${new Date().getFullYear()} Anteo Impresa Sociale</span>
      <nav class="piede-legali" aria-label="Informazioni legali">
        ${['Informativa privacy', 'Cookie', 'Dichiarazione di accessibilità', 'Contatti']
          .map((v) => `<a href="#">${e(v)}</a>`).join('')}
      </nav>
    </div>
  </div>
</footer>`;

/**
 * Le briciole erano una fila di <span> separati da un carattere «›» messo
 * con ::before. Per chi legge con lo schermo parlante non erano un percorso
 * ma una riga di parole sciolte, e nessuna era cliccabile: dalla scheda di
 * una RSA non si poteva risalire al settore. Adesso sono un elenco ordinato
 * dentro una navigazione, e ogni voce tranne l'ultima è un collegamento.
 */
export const briciole = (voci, url = []) =>
  `<nav class="guscio briciole" aria-label="Dove sei">
    <ol>${voci
      .map((v, i) =>
        i === voci.length - 1
          ? `<li><span aria-current="page">${e(v)}</span></li>`
          : `<li><a href="${e(url[i] ?? '#')}">${e(v)}</a></li>`,
      )
      .join('')}</ol>
  </nav>`;

/** Il contenuto vero della pagina comincia qui: è la meta del salto. */
export const apri = '<main id="contenuto" tabindex="-1">';
export const chiudi = '</main>';
