-- campaigns: Marketing campaigns with UTM parameters for traffic attribution.
-- See README.md for full design rationale.

CREATE TABLE campaigns (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  source        TEXT NOT NULL,
  medium        TEXT NOT NULL,
  term          TEXT,
  content       TEXT,
  landing_url   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_by    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source, medium, name)
);

CREATE INDEX idx_campaigns_is_active ON campaigns (is_active);
CREATE INDEX idx_campaigns_created_by ON campaigns (created_by);
