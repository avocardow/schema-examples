-- translation_memory_entries: Cached source/target text pairs for reuse and consistency.
-- See README.md for full design rationale.

CREATE TABLE translation_memory_entries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_locale_id  UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  target_locale_id  UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  source_text       TEXT NOT NULL,
  target_text       TEXT NOT NULL,
  source_hash       TEXT NOT NULL,
  domain            TEXT,
  quality_score     NUMERIC,
  usage_count       INTEGER NOT NULL DEFAULT 0,
  source            TEXT NOT NULL DEFAULT 'human',
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_translation_memory_entries_source_target_hash
  ON translation_memory_entries (source_locale_id, target_locale_id, source_hash);
CREATE INDEX idx_translation_memory_entries_source_locale_id_target_locale_id
  ON translation_memory_entries (source_locale_id, target_locale_id);
CREATE INDEX idx_translation_memory_entries_domain ON translation_memory_entries (domain);
