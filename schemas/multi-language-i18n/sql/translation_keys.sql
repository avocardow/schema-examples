-- translation_keys: Translatable string identifiers scoped to a namespace.
-- See README.md for full design rationale.

CREATE TABLE translation_keys (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  namespace_id  UUID NOT NULL REFERENCES namespaces(id) ON DELETE CASCADE,
  key           TEXT NOT NULL,
  description   TEXT,
  max_length    INTEGER,
  is_plural     BOOLEAN NOT NULL DEFAULT FALSE,
  format        TEXT NOT NULL DEFAULT 'text',
  is_hidden     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (namespace_id, key)
);

CREATE INDEX idx_translation_keys_is_plural ON translation_keys (is_plural);
