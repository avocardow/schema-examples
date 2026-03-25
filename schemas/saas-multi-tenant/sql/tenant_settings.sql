-- tenant_settings: Per-organization key-value configuration settings.
-- See README.md for full design rationale.

CREATE TABLE tenant_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  key             TEXT NOT NULL,
  value           TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, key)
);
