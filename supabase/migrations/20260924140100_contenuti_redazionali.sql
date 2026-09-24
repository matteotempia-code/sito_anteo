-- migrazione 02 — contenuti redazionali (cms)

-- Ereditarieta' tipologia -> sede: i testi si scrivono 29 volte, non 840.

create type cms.stato_contenuto as enum ('bozza','in-revisione','pubblicato','archiviato');

create table cms.tipologia (
  codice              text primary key references erp.tassonomia(codice) on delete restrict,
  nome_pubblico       text not null,
  settore             erp.settore not null,
  cosa_e              text,
  per_chi             text,
  per_chi_no          text,
  come_si_entra       text,
  chi_ci_lavora       text,
  una_giornata        text,
  nota_costi          text,
  gulpease            smallint check (gulpease between 0 and 100),
  stato               cms.stato_contenuto not null default 'bozza',
  revisione_entro     date,
  aggiornato_da       text,
  aggiornato_il       timestamptz not null default now()
);
-- per_chi_no: per chi questo servizio NON e'. Dirlo evita a una famiglia di
-- perdere settimane sulla porta sbagliata.
-- nota_costi: spiega da cosa dipende il costo e promette un colloquio.
-- NESSUN IMPORTO, MAI. Variante distinta per i servizi a carico ASL.

create table cms.sede_testo (
  sede_id             text primary key references erp.sede(id_gestionale) on delete cascade,
  sottotitolo         text,
  scostamento         text,
  come_si_arriva      text,
  note_visita         text,
  referente_nome      text,
  referente_telefono  text,
  referente_email     text,
  stato               cms.stato_contenuto not null default 'bozza',
  revisione_entro     date,
  aggiornato_da       text,
  aggiornato_il       timestamptz not null default now(),
  constraint referente_completo check (
    stato <> 'pubblicato'
    or (referente_nome is not null and (referente_telefono is not null or referente_email is not null))
  )
);
-- referente_completo e' un campo bloccante: non si pubblica una sede senza una
-- persona a cui rivolgersi. Non un centralino.

create table cms.media (
  id            uuid primary key default gen_random_uuid(),
  sede_id       text references erp.sede(id_gestionale) on delete cascade,
  tipologia_cod text references cms.tipologia(codice) on delete cascade,
  url           text not null,
  alt           text not null check (length(btrim(alt)) >= 10),
  didascalia    text,
  ordine        smallint not null default 0,
  reale         boolean not null default true,
  aggiornato_il timestamptz not null default now(),
  constraint media_ha_un_proprietario check (num_nonnulls(sede_id, tipologia_cod) = 1)
);
-- alt e' bloccante, non una raccomandazione: senza testo alternativo l'immagine
-- non si salva. reale = falso marca una foto di repertorio, cosi' si sa quante
-- sedi aspettano ancora il servizio fotografico.
create index on cms.media (sede_id, ordine);

create table cms.glossario (
  sigla         text primary key,
  per_esteso    text not null,
  spiegazione   text not null,
  aggiornato_il timestamptz not null default now()
);

create table cms.faq (
  id            uuid primary key default gen_random_uuid(),
  settore       erp.settore,
  tipologia_cod text references cms.tipologia(codice) on delete cascade,
  domanda       text not null,
  risposta      text not null,
  ordine        smallint not null default 0,
  stato         cms.stato_contenuto not null default 'bozza'
);
create index on cms.faq (settore, ordine);

create table cms.guida (
  slug          text primary key,
  titolo        text not null,
  occhiello     text,
  corpo         text not null,
  settore       erp.settore,
  gulpease      smallint check (gulpease between 0 and 100),
  stato         cms.stato_contenuto not null default 'bozza',
  revisione_entro date,
  aggiornato_il timestamptz not null default now()
);

create table cms.pagina_territoriale (
  slug             text primary key,
  tipologia_cod    text not null references cms.tipologia(codice) on delete cascade,
  provincia        text not null,
  titolo           text not null,
  corpo_locale     text,
  stato            cms.stato_contenuto not null default 'bozza',
  aggiornato_il    timestamptz not null default now(),
  unique (tipologia_cod, provincia)
);
-- corpo_locale: contenuto proprio di quel territorio. Senza, la pagina e' un
-- doppione generato: non si pubblica.

create table cms.professione (
  slug             text primary key,
  titolo           text not null,
  qualifica_codice text references erp.tassonomia(codice),
  giornata_tipo    text,
  cosa_serve       text,
  crescita         text,
  citazione        text,
  citazione_autore text,
  stato            cms.stato_contenuto not null default 'bozza',
  aggiornato_il    timestamptz not null default now()
);

create table cms.redirect (
  percorso_vecchio text primary key,
  percorso_nuovo   text not null,
  codice           smallint not null default 301 check (codice in (301,302,308)),
  creato_il        timestamptz not null default now()
);

alter table cms.tipologia           enable row level security;
alter table cms.sede_testo          enable row level security;
alter table cms.media               enable row level security;
alter table cms.glossario           enable row level security;
alter table cms.faq                 enable row level security;
alter table cms.guida               enable row level security;
alter table cms.pagina_territoriale enable row level security;
alter table cms.professione         enable row level security;
alter table cms.redirect            enable row level security;
