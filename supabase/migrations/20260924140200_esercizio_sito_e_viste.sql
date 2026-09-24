-- migrazione 03 — esercizio del sito e vista scheda

-- Qui finiscono dati personali: chiusura totale, nessuna esposizione via API.

create table sito.richiamata (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  telefono      text not null,
  fascia_oraria text check (fascia_oraria in ('mattino','pomeriggio','sera','indifferente')),
  tipo_bisogno  text,
  sede_id       text references erp.sede(id_gestionale) on delete set null,
  messaggio     text,
  stato         text not null default 'da richiamare'
                check (stato in ('da richiamare','richiamata','chiusa','non raggiungibile')),
  assegnata_a   text,
  creata_il     timestamptz not null default now(),
  chiusa_il     timestamptz
);
-- Il tipo di bisogno puo' rivelare una condizione sanitaria: dato particolare,
-- art. 9 GDPR. Conservazione limitata, accesso registrato, mai in analytics.
create index on sito.richiamata (stato, creata_il desc);

create table sito.visita (
  id          uuid primary key default gen_random_uuid(),
  sede_id     text not null references erp.sede(id_gestionale) on delete cascade,
  nome        text not null,
  telefono    text not null,
  email       text,
  quando      timestamptz not null,
  stato       text not null default 'richiesta'
              check (stato in ('richiesta','confermata','annullata','avvenuta')),
  creata_il   timestamptz not null default now()
);

create table sito.candidatura (
  id              uuid primary key default gen_random_uuid(),
  annuncio_id     text,
  nome            text not null,
  telefono        text not null,
  email           text,
  qualifica_cod   text references erp.tassonomia(codice),
  provincia       text,
  cv_url          text,
  consenso_selezione boolean not null,
  consenso_futuro    boolean not null default false,
  creata_il       timestamptz not null default now(),
  constraint consenso_selezione_obbligatorio check (consenso_selezione)
);
-- Due consensi distinti, nessuno preselezionato: il primo e' necessario per
-- candidarsi, il secondo e' facoltativo.

create table sito.ricerca (
  id          bigint generated always as identity primary key,
  testo       text not null,
  filtri      jsonb,
  risultati   integer not null,
  percorso    text,
  quando      timestamptz not null default now()
);
-- Mai categorie sanitarie in chiaro dove possano finire in URL, referrer o
-- analytics: il filtro per bisogno viaggia in POST.
create index on sito.ricerca (quando desc) where risultati = 0;

alter table sito.richiamata  enable row level security;
alter table sito.visita      enable row level security;
alter table sito.candidatura enable row level security;
alter table sito.ricerca     enable row level security;

-- La vista che il sito legge davvero: la sede con i testi gia' ereditati dalla
-- tipologia, gli scostamenti applicati e l'indirizzo oscurato quando non e'
-- pubblicabile. Il sito legge questa, non le tabelle.
create view sito.scheda_sede
with (security_invoker = true) as
select
  s.id_gestionale                              as sede_id,
  s.denominazione,
  s.comune, s.provincia, s.regione,
  case when s.indirizzo_pubblicabile then s.indirizzo    end as indirizzo,
  case when s.indirizzo_pubblicabile then s.latitudine   end as latitudine,
  case when s.indirizzo_pubblicabile then s.longitudine  end as longitudine,
  s.indirizzo_pubblicabile,
  s.telefono, s.email,
  case when s.consenso_pubblicazione then s.direttore_nome     end as direttore_nome,
  case when s.consenso_foto          then s.direttore_foto_url end as direttore_foto_url,
  t.codice                                     as tipologia_codice,
  coalesce(ct.nome_pubblico, t.etichetta)      as tipologia,
  sv.settore,
  coalesce(ct.cosa_e, '')                      as cosa_e,
  coalesce(ct.per_chi, '')                     as per_chi,
  coalesce(ct.per_chi_no, '')                  as per_chi_no,
  coalesce(ct.come_si_entra, '')               as come_si_entra,
  coalesce(ct.chi_ci_lavora, '')               as chi_ci_lavora,
  coalesce(ct.nota_costi, '')                  as nota_costi,
  st.sottotitolo,
  st.scostamento,
  st.come_si_arriva,
  st.referente_nome, st.referente_telefono, st.referente_email,
  bool_and(sv.accesso_diretto)                 as accesso_diretto,
  sum(sv.posti_autorizzati)                    as posti_autorizzati,
  sum(d.posti_liberi)                          as posti_liberi,
  max(d.letto_il)                              as disponibilita_letta_il,
  bool_and(coalesce(d.attendibile, true))      as disponibilita_attendibile,
  greatest(s.aggiornato_il, coalesce(ct.aggiornato_il, s.aggiornato_il),
           coalesce(st.aggiornato_il, s.aggiornato_il)) as aggiornato_il
from erp.sede s
join erp.servizio sv        on sv.sede_id = s.id_gestionale and sv.attivo
join erp.tassonomia t       on t.codice = sv.tipologia_codice
left join cms.tipologia ct  on ct.codice = t.codice and ct.stato = 'pubblicato'
left join cms.sede_testo st on st.sede_id = s.id_gestionale and st.stato = 'pubblicato'
left join erp.disponibilita d on d.servizio_id = sv.id_gestionale
where s.attiva
group by s.id_gestionale, t.codice, t.etichetta, ct.nome_pubblico, sv.settore,
         ct.cosa_e, ct.per_chi, ct.per_chi_no, ct.come_si_entra, ct.chi_ci_lavora,
         ct.nota_costi, ct.aggiornato_il,
         st.sottotitolo, st.scostamento, st.come_si_arriva,
         st.referente_nome, st.referente_telefono, st.referente_email, st.aggiornato_il;

-- I sei settori, gia' caricati in erp.tassonomia:
--   salute-mentale · anziani · disabilita · minori · dipendenze · sociale
