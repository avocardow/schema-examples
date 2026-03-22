-- translation_values: Translated strings per key/locale with review workflow and plural support.
-- See README.md for full design rationale.

CREATE TYPE translation_value_status AS ENUM ('draft', 'in_review', 'approved', 'published', 'rejected');

CREATE TABLE translation_values (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_key_id    UUID NOT NULL REFERENCES translation_keys(id) ON DELETE CASCADE,
  locale_id             UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  plural_category       TEXT,
  value                 TEXT NOT NULL,
  status                translation_value_status NOT NULL DEFAULT 'draft',
  is_machine_translated BOOLEAN NOT NULL DEFAULT FALSE,
  source_digest         TEXT,
  translator_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (translation_key_id, locale_id, plural_category)
);

-- Partial unique index for non-plural keys (NULL plural_category)
CREATE UNIQUE INDEX idx_translation_values_key_locale_non_plural
  ON translation_values (translation_key_id, locale_id)
  WHERE plural_category IS NULL;

CREATE INDEX idx_translation_values_locale_id_status ON translation_values (locale_id, status);
CREATE INDEX idx_translation_values_translation_key_id ON translation_values (translation_key_id);
CREATE INDEX idx_translation_values_status ON translation_values (status);
CREATE INDEX idx_translation_values_translator_id ON translation_values (translator_id);
