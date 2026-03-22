-- dashboards: Configurable analytics dashboards with layout, visibility, and auto-refresh settings.
-- See README.md for full design rationale.

CREATE TYPE dashboard_visibility AS ENUM ('private', 'team', 'public');

CREATE TABLE dashboards (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  description      TEXT,
  layout           JSONB,
  visibility       dashboard_visibility NOT NULL DEFAULT 'private',
  is_default       BOOLEAN NOT NULL DEFAULT FALSE,
  refresh_interval INTEGER,
  created_by       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dashboards_created_by ON dashboards (created_by);
CREATE INDEX idx_dashboards_visibility ON dashboards (visibility);
CREATE INDEX idx_dashboards_is_default ON dashboards (is_default);
