-- kb_categories: Organizational categories for knowledge base articles.
-- See README.md for full design rationale.

CREATE TABLE kb_categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  parent_id    UUID REFERENCES kb_categories (id) ON DELETE SET NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kb_categories_parent_sort ON kb_categories (parent_id, sort_order);
