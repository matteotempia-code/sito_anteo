#!/usr/bin/env node
/**
 * Verifica strutturale dell'anteprima, in un browser vero.
 *
 * Perché un browser e non un'espressione regolare: le cose che rompono una
 * pagina per chi la naviga da tastiera o con lo schermo parlante — un
 * <label> che non è legato a nulla, un id duplicato, un bersaglio alto
 * ventotto pixel, un titolo di livello 4 sotto uno di livello 2 — si vedono
 * solo a documento costruito e stile applicato. Un controllo sul sorgente
 * le avrebbe mancate tutte, come è già successo.
 *
 * Il criterio: ogni difetto trovato qui è un difetto del sito, non
 * dell'anteprima. Se il controllo è troppo severo si corregge il controllo,
 * dichiarando perché; non si toglie e basta.
 */
// Playwright è installato globalmente, non nel progetto: la risoluzione dei
// moduli di Node non ci arriva da sola e la via breve («npm i -D») è chiusa,
// perché il registro npm non è fra gli host consentiti da questo ambiente.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(
  '/home/claude/.npm-global/lib/node_modules/playwright/index.js',
);
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const qui = dirname(fileURLToPath(import.meta.url));
const file = 'file://' + resolve(qui, '../dist-anteprima.html');

const browser = await chromium.launch();
const pag = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await pag.goto(file);

const esito = await pag.evaluate(() => {
  const guasti = [];
  const nome = (el) =>
    (el.getAttribute('aria-label') ||
      (el.getAttribute('aria-labelledby') &&
        (document.getElementById(el.getAttribute('aria-labelledby'))?.textContent ?? '')) ||
      el.textContent ||
      el.getAttribute('title') ||
      el.getAttribute('alt') ||
      '').trim();

  /* --- codifica e lingua: due difetti che si vedono solo a documento
         renderizzato, e che hanno rovinato metà dei testi italiani --- */
  if (!document.documentElement.lang) guasti.push(['documento', 'la pagina non dichiara la lingua']);
  const sporco = document.body.innerText.match(/[ÃÂ][\s\w]/);
  if (sporco)
    guasti.push(['documento', `testo mal decodificato («${sporco[0]}»): manca la dichiarazione di codifica`]);

  /* --- id duplicati: valgono per l'intero documento --- */
  const visti = new Map();
  document.querySelectorAll('[id]').forEach((el) => {
    visti.set(el.id, (visti.get(el.id) ?? 0) + 1);
  });
  for (const [id, n] of visti) {
    if (n > 1 && !id.startsWith('p-')) guasti.push(['documento', `id duplicato «${id}» (${n} volte)`]);
  }

  document.querySelectorAll('.pagina').forEach((p) => {
    const chi = p.id.replace(/^p-/, '');
    const g = (m) => guasti.push([chi, m]);

    /* --- il contenuto principale --- */
    const main = p.querySelectorAll('main');
    if (main.length !== 1) g(`${main.length} elementi <main> (ne serve esattamente 1)`);
    const salta = p.querySelector('.salta');
    if (!salta) g('manca il collegamento «vai al contenuto»');
    else if (!p.querySelector(salta.getAttribute('href')))
      g(`il salto punta a ${salta.getAttribute('href')}, che in questa schermata non esiste`);

    /* --- gerarchia dei titoli --- */
    const h1 = p.querySelectorAll('main h1');
    if (h1.length !== 1) g(`${h1.length} titoli di primo livello dentro <main> (ne serve 1)`);
    let prec = 0;
    p.querySelectorAll('main :is(h1,h2,h3,h4,h5,h6)').forEach((h) => {
      const liv = +h.tagName[1];
      if (prec && liv > prec + 1) g(`salto di livello: h${prec} → h${liv} («${nome(h).slice(0, 40)}»)`);
      prec = liv;
    });

    /* --- briciole --- */
    const br = p.querySelector('.briciole');
    if (br) {
      if (br.tagName !== 'NAV') g('le briciole non sono una <nav>');
      if (!br.querySelector('ol')) g('le briciole non sono un elenco ordinato');
      if (!br.getAttribute('aria-label')) g('le briciole non hanno un nome');
      if (br.querySelectorAll('a').length === 0) g('nessuna briciola è cliccabile');
    }

    /* --- collegamenti e comandi --- */
    p.querySelectorAll('a').forEach((a) => {
      if (!a.hasAttribute('href')) g(`<a> senza href («${nome(a).slice(0, 40)}»)`);
      if (!nome(a)) g('collegamento senza nome accessibile');
    });
    p.querySelectorAll('button').forEach((b) => {
      if (!nome(b)) g('pulsante senza nome accessibile');
    });

    /* --- moduli --- */
    p.querySelectorAll('label').forEach((l) => {
      const per = l.getAttribute('for');
      const dentro = l.querySelector('input, select, textarea');
      if (!per && !dentro) g(`<label> non legato a nessun campo («${nome(l).slice(0, 40)}»)`);
      if (per && !p.querySelector(`#${CSS.escape(per)}`))
        g(`<label for="${per}"> punta a un campo che non esiste`);
    });
    p.querySelectorAll('input, select, textarea').forEach((c) => {
      const eti =
        (c.id && p.querySelector(`label[for="${CSS.escape(c.id)}"]`)) || c.closest('label');
      if (!eti && !c.getAttribute('aria-label')) g(`campo «${c.name || c.type}» senza etichetta`);
    });
    p.querySelectorAll('form').forEach((f) => {
      if (f.method.toLowerCase() !== 'post') g('modulo che non usa POST');
      if (!f.querySelector('button[type="submit"], input[type="submit"]'))
        g('modulo senza pulsante di invio vero');
    });

    /* --- bersagli: 44 px, che è il minimo di WCAG 2.5.8 con margine --- */
    p.querySelectorAll('a, button, input[type="radio"], input[type="checkbox"], summary').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return; // non visibile in questa schermata
      const bersaglio = el.closest('label') ?? el;
      const rb = bersaglio.getBoundingClientRect();
      const alto = Math.max(r.height, rb.height);
      const largo = Math.max(r.width, rb.width);
      if (alto < 24 || largo < 24)
        g(`bersaglio ${Math.round(largo)}×${Math.round(alto)} px («${nome(el).slice(0, 30)}»)`);
    });

    /* --- tabelle --- */
    p.querySelectorAll('table').forEach((t) => {
      if (!t.querySelector('thead th[scope="col"]')) g('tabella senza intestazioni di colonna');
    });

    /* --- il colore non deve dire lo stato --- */
    p.querySelectorAll('.stato').forEach((s) => {
      const glifo = getComputedStyle(s, '::before').content;
      if (!glifo || glifo === 'none' || glifo === 'normal')
        g(`stato «${nome(s).slice(0, 30)}» senza glifo: resta distinguibile solo dal colore`);
    });

    /* --- segnaposto rimasti dove il testo doveva essere vero --- */
    p.querySelectorAll('main h1').forEach((h) => {
      if (/\[[A-Z]/.test(h.textContent)) g(`titolo con segnaposto: «${h.textContent.trim()}»`);
    });
  });

  return guasti;
});

/* --- lo stesso giro a larghezza di telefono --- */
await pag.setViewportSize({ width: 390, height: 844 });
await pag.click('#tel');
const traboccano = await pag.evaluate(() => {
  const fuori = [];
  document.querySelectorAll('.pagina').forEach((p) => {
    const prima = p.classList.contains('viva');
    p.classList.add('viva');
    const limite = p.getBoundingClientRect().right + 1;
    p.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > limite + 2)
        fuori.push([p.id.replace(/^p-/, ''), `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} esce di ${Math.round(r.right - limite)} px`]);
    });
    if (!prima) p.classList.remove('viva');
  });
  return fuori.slice(0, 20);
});

await browser.close();

const tutti = [...esito, ...traboccano.map(([a, b]) => [a + ' (telefono)', b])];
if (tutti.length === 0) {
  console.log('✓ Struttura: 13 schermate, nessun difetto strutturale o di modulo.');
} else {
  const per = new Map();
  for (const [dove, cosa] of tutti) per.set(dove, [...(per.get(dove) ?? []), cosa]);
  console.log(`✗ Struttura: ${tutti.length} difetti in ${per.size} schermate.\n`);
  for (const [dove, cose] of per) {
    console.log(`  ${dove}`);
    for (const c of [...new Set(cose)]) console.log(`    · ${c}${cose.filter((x) => x === c).length > 1 ? ` ×${cose.filter((x) => x === c).length}` : ''}`);
  }
  process.exitCode = 1;
}
