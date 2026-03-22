-- translation_key_tags: Free-form tags for categorizing and filtering translation keys.
-- See README.md for full design rationale.

CREATE TABLE translation_key_tags (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_key_id  UUID NOT NULL REFERENCES translation_keys(id) ON DELETE CASCADE,
  tag                 TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (translation_key_id, tag)
);

CREATE INDEX idx_translation_key_tags_tag ON translation_key_tags (tag);
