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
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  compressHTML: true,
  devToolbar: { enabled: false },
});
