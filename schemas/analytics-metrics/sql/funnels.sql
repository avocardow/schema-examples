-- funnels: Multi-step conversion funnels with configurable time windows.
-- See README.md for full design rationale.

CREATE TABLE funnels (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  description         TEXT,
  conversion_window   INTEGER NOT NULL DEFAULT 86400,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_by          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_funnels_is_active ON funnels (is_active);
CREATE INDEX idx_funnels_created_by ON funnels (created_by);
