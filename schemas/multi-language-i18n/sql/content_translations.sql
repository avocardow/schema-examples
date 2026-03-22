-- content_translations: Per-field translations for arbitrary entity records.
-- See README.md for full design rationale.
-- Reuses translation_value_status enum defined in translation_values.sql.

CREATE TABLE content_translations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id     UUID NOT NULL REFERENCES translatable_resources(id) ON DELETE CASCADE,
  entity_id       TEXT NOT NULL,
  locale_id       UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  field_name      TEXT NOT NULL,
  value           TEXT NOT NULL,
  status          translation_value_status NOT NULL DEFAULT 'draft',
  source_digest   TEXT,
  translator_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  version         INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (resource_id, entity_id, locale_id, field_name)
);

CREATE INDEX idx_content_translations_resource_id_entity_id ON content_translations (resource_id, entity_id);
CREATE INDEX idx_content_translations_locale_id ON content_translations (locale_id);
CREATE INDEX idx_content_translations_status ON content_translations (status);
