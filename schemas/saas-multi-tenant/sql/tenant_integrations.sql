-- tenant_integrations: Tracks third-party integrations connected by each organization.
-- See README.md for full design rationale.

CREATE TYPE tenant_integration_status AS ENUM ('active', 'inactive', 'error');

CREATE TABLE tenant_integrations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  integration_id        UUID NOT NULL REFERENCES integration_definitions (id) ON DELETE RESTRICT,
  status                tenant_integration_status NOT NULL DEFAULT 'active',
  encrypted_credentials JSONB,
  config                JSONB,
  connected_by          UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  last_synced_at        TIMESTAMPTZ,
  error_message         TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, integration_id)
);

CREATE INDEX idx_tenant_integrations_integration_id ON tenant_integrations (integration_id);
CREATE INDEX idx_tenant_integrations_status         ON tenant_integrations (status);
