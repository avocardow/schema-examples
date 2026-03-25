-- plan_prices: Pricing tiers for plans with interval and billing model.
-- See README.md for full design rationale.

CREATE TYPE price_type AS ENUM (
  'recurring', 'one_time', 'usage_based'
);

CREATE TYPE price_interval AS ENUM (
  'day', 'week', 'month', 'year'
);

CREATE TABLE plan_prices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id           UUID NOT NULL REFERENCES plans (id) ON DELETE CASCADE,
  nickname          TEXT,
  type              price_type NOT NULL DEFAULT 'recurring',
  amount            INTEGER NOT NULL,
  currency          TEXT NOT NULL,
  interval          price_interval,
  interval_count    INTEGER NOT NULL DEFAULT 1,
  trial_period_days INTEGER,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  metadata          JSONB,
  provider_type     TEXT,
  provider_id       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plan_prices_plan_id ON plan_prices (plan_id);
CREATE INDEX idx_plan_prices_is_active ON plan_prices (is_active);
CREATE INDEX idx_plan_prices_provider ON plan_prices (provider_type, provider_id);
