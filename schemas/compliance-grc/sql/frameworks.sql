-- frameworks: Regulatory and compliance frameworks tracked by the organization.
-- See README.md for full design rationale.

CREATE TABLE frameworks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations (id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  version         TEXT,
  authority       TEXT,
  description     TEXT,
  website_url     TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_frameworks_organization_id ON frameworks (organization_id);
CREATE INDEX idx_frameworks_is_active ON frameworks (is_active);
