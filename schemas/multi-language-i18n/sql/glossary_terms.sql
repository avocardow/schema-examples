-- glossary_terms: Controlled terminology with domain scope and forbidden-term support.
-- See README.md for full design rationale.

CREATE TABLE glossary_terms (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term              TEXT NOT NULL,
  description       TEXT,
  part_of_speech    TEXT,
  domain            TEXT,
  source_locale_id  UUID NOT NULL REFERENCES locales(id) ON DELETE RESTRICT,
  is_forbidden      BOOLEAN NOT NULL DEFAULT FALSE,
  is_case_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
  notes             TEXT,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_glossary_terms_source_locale_id_term ON glossary_terms (source_locale_id, term);
CREATE INDEX idx_glossary_terms_domain ON glossary_terms (domain);
