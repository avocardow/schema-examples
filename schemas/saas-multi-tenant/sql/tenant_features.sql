-- tenant_features: Maps enabled features and their limits to each organization.
-- See README.md for full design rationale.

CREATE TYPE tenant_feature_source AS ENUM ('plan', 'override', 'trial', 'custom');

CREATE TABLE tenant_features (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  feature_id      UUID NOT NULL REFERENCES features (id) ON DELETE CASCADE,
  is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  limit_value     INTEGER,
  source          tenant_feature_source NOT NULL DEFAULT 'plan',
  expires_at      TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, feature_id)
);

CREATE INDEX idx_tenant_features_feature_id ON tenant_features (feature_id);
CREATE INDEX idx_tenant_features_source     ON tenant_features (source);
CREATE INDEX idx_tenant_features_expires_at ON tenant_features (expires_at);
