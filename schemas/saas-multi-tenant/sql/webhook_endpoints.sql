-- webhook_endpoints: Subscriber-registered HTTP endpoints for receiving event webhooks.
-- See README.md for full design rationale.

CREATE TYPE webhook_status AS ENUM ('active', 'paused', 'disabled');

CREATE TABLE webhook_endpoints (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  description     TEXT,
  signing_secret  TEXT NOT NULL,
  status          webhook_status NOT NULL DEFAULT 'active',
  failure_count   INTEGER NOT NULL DEFAULT 0,
  last_success_at TIMESTAMPTZ,
  last_failure_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_endpoints_organization_id ON webhook_endpoints (organization_id);
CREATE INDEX idx_webhook_endpoints_status          ON webhook_endpoints (status);
