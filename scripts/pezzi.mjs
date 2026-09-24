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

const marchio = (file) =>
  'data:image/svg+xml;base64,' +
  readFileSync(resolve(qui, `../public/marchio/${file}`)).toString('base64');

export const LOGO = marchio('logo-lockup.svg');
export const LOGO_BIANCO = marchio('logo-lockup-bianco.svg');

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

/** La testata, con la barra di servizio, il marchio vero, la ricerca. */
export const testata = (attiva = '') => `
<div class="barra-servizio">
  <div class="guscio riga-servizio">
    <span>${e(CONTATTI.claim)}</span>
    <span class="servizio-destra">
      <span class="verde">Numero verde <strong class="numeri">${e(CONTATTI.numeroVerde)}</strong> · ${e(CONTATTI.orari)}</span>
      <span class="soci">Area soci</span>
    </span>
  </div>
</div>
<header class="sito-testata">
  <div class="guscio riga-testata">
    <img class="marchio" src="${LOGO}" alt="Anteo Impresa Sociale" width="318" height="305">
    <nav aria-label="Navigazione principale">
      ${NAVIGAZIONE.map(([, v]) => `<span${v === attiva ? ' class="attiva" aria-current="page"' : ''}>${e(v)}</span>`).join('')}
    </nav>
    <span class="ricerca">${icona('lente', 'piccola')}<span>Cerca</span></span>
  </div>
</header>`;

/** Il piè di pagina: marchio in negativo, recapiti, tre colonne. */
export const piede = `
<footer class="sito-piede">
  <div class="guscio">
    <div class="piede-alto">
      <div class="piede-identita">
        <img class="marchio-bianco" src="${LOGO_BIANCO}" alt="Anteo Impresa Sociale" width="318" height="305">
        <p class="piede-nome"><strong>Anteo Impresa Sociale</strong><br>società cooperativa sociale</p>
        <p class="piede-recapiti">${e(CONTATTI.indirizzo)}<br>
          <span class="numeri">${e(CONTATTI.telefono)}</span> · ${e(CONTATTI.email)}</p>
      </div>
      ${PIEDE.map((c) => `
      <nav class="piede-colonna" aria-label="${e(c.titolo)}">
        <h2>${e(c.titolo)}</h2>
        <ul>${c.voci.map((v) => `<li><span>${e(v)}</span></li>`).join('')}</ul>
      </nav>`).join('')}
    </div>
    <div class="piede-basso">
      <span>© ${new Date().getFullYear()} Anteo Impresa Sociale</span>
      <span class="piede-legali">Informativa privacy · Cookie · Dichiarazione di accessibilità · Contatti</span>
    </div>
  </div>
</footer>`;

export const briciole = (voci) =>
  `<div class="guscio briciole">${voci
    .map((v, i) => `<span${i === voci.length - 1 ? ' aria-current="page"' : ''}>${e(v)}</span>`)
    .join(' ')}</div>`;
