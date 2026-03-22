-- translation_comments: Threaded discussion on translations with optional issue tracking.
-- See README.md for full design rationale.

CREATE TABLE translation_comments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_type  TEXT NOT NULL,
  translation_id    UUID NOT NULL,
  parent_id         UUID REFERENCES translation_comments(id) ON DELETE CASCADE,
  author_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body              TEXT NOT NULL,
  issue_type        TEXT,
  is_resolved       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_translation_comments_type_id
  ON translation_comments (translation_type, translation_id);
CREATE INDEX idx_translation_comments_parent_id ON translation_comments (parent_id);
CREATE INDEX idx_translation_comments_author_id ON translation_comments (author_id);
