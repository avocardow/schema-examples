-- plans: Product plans available for subscription.
-- See README.md for full design rationale.

CREATE TABLE plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  metadata      JSONB,
  provider_type TEXT,
  provider_id   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plans_is_active ON plans (is_active);
CREATE INDEX idx_plans_provider ON plans (provider_type, provider_id);
