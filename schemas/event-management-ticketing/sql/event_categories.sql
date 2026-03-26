-- event_categories: Hierarchical classification of events with optional parent categories.
-- See README.md for full design rationale.

CREATE TABLE event_categories (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT,
  parent_id           UUID REFERENCES event_categories (id) ON DELETE SET NULL,
  position            INTEGER NOT NULL DEFAULT 0,
  color               TEXT,
  icon                TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_categories_parent_id ON event_categories (parent_id);
CREATE INDEX idx_event_categories_is_active_position ON event_categories (is_active, position);
