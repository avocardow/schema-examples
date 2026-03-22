-- translation_status_history: Audit log of status transitions for any translation type.
-- See README.md for full design rationale.

CREATE TABLE translation_status_history (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_type  TEXT NOT NULL,
  translation_id    UUID NOT NULL,
  from_status       TEXT,
  to_status         TEXT NOT NULL,
  changed_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  comment           TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_translation_status_history_type_id
  ON translation_status_history (translation_type, translation_id);
CREATE INDEX idx_translation_status_history_changed_by
  ON translation_status_history (changed_by);
