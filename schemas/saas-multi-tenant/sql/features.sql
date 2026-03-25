-- features: Catalogue of toggleable and measurable product features.
-- See README.md for full design rationale.

CREATE TYPE feature_type AS ENUM ('boolean', 'limit', 'metered');

CREATE TABLE features (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key          TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  feature_type feature_type NOT NULL,
  unit         TEXT,
  is_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_features_feature_type ON features (feature_type);
CREATE INDEX idx_features_is_enabled   ON features (is_enabled);
