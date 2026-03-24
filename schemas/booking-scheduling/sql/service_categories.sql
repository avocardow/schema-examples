-- service_categories: Hierarchical grouping of services for organization and display.
-- See README.md for full design rationale.

CREATE TABLE service_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  parent_id       UUID REFERENCES service_categories (id) ON DELETE SET NULL,
  position        INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_categories_parent_id ON service_categories (parent_id);
CREATE INDEX idx_service_categories_is_active_position ON service_categories (is_active, position);
