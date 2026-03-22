-- translation_reviews: Reviewer actions (approve, reject, request changes) on translations.
-- See README.md for full design rationale.

CREATE TYPE translation_review_action AS ENUM ('approve', 'reject', 'request_changes');

CREATE TABLE translation_reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_type  TEXT NOT NULL,
  translation_id    UUID NOT NULL,
  reviewer_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action            translation_review_action NOT NULL,
  comment           TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_translation_reviews_type_id
  ON translation_reviews (translation_type, translation_id);
CREATE INDEX idx_translation_reviews_reviewer_id ON translation_reviews (reviewer_id);
