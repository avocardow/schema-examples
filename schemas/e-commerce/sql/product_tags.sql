-- product_tags: Freeform tags for flexible product classification and filtering.
-- See README.md for full design rationale.

CREATE TABLE product_tags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
