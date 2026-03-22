-- translation_groups: Links translatable entities to their source locale for tracking completeness.
-- See README.md for full design rationale.

CREATE TABLE translation_groups (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id       UUID NOT NULL REFERENCES translatable_resources(id) ON DELETE CASCADE,
  entity_id         TEXT NOT NULL,
  source_locale_id  UUID NOT NULL REFERENCES locales(id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (resource_id, entity_id)
);

CREATE INDEX idx_translation_groups_source_locale_id ON translation_groups (source_locale_id);
