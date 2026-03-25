-- customers: Billable entities linked to users or organizations.
-- See README.md for full design rationale.

CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations (id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  currency        TEXT,
  tax_id          TEXT,
  metadata        JSONB,
  provider_type   TEXT,
  provider_id     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_user_id ON customers (user_id);
CREATE INDEX idx_customers_organization_id ON customers (organization_id);
CREATE INDEX idx_customers_provider ON customers (provider_type, provider_id);
