-- glossary_term_translations: Approved translations of glossary terms per locale.
-- See README.md for full design rationale.

CREATE TYPE glossary_term_status AS ENUM ('draft', 'approved');

CREATE TABLE glossary_term_translations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id       UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
  locale_id     UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  translation   TEXT NOT NULL,
  notes         TEXT,
  status        glossary_term_status NOT NULL DEFAULT 'draft',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (term_id, locale_id)
);

CREATE INDEX idx_glossary_term_translations_locale_id ON glossary_term_translations (locale_id);
