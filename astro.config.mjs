// @ts-check
import { defineConfig } from 'astro/config';

// Il sito pubblico di Anteo Impresa Sociale.
// Le pagine sono contenuto, non applicazione: si generano in HTML e non
// spediscono JavaScript se non dove serve davvero. È il modo più diretto di
// stare sotto i 2,5 s di LCP con 140 schede e 80 pagine territoriali.
export default defineConfig({
  site: 'https://www.anteocoop.it',
  output: 'static',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
  // Il prefetch automatico è disattivato di proposito. Con prefetchAll, il
  // solo passaggio del mouse su /servizi/dipendenze/... o
  // /servizi/salute-mentale/... genera una richiesta: il percorso, che
  // rivela una condizione di salute, finisce nei log anche senza un clic.
  // Il prefetch si attiva a mano, voce per voce, solo sui percorsi neutri.
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'tap',
  },
  compressHTML: true,
  devToolbar: { enabled: false },
});
