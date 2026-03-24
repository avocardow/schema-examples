-- tags: Reusable labels applied to contacts, companies, and deals.
-- See README.md for full design rationale.

CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  color      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
