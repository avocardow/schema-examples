-- subscription_items: Line items linking subscriptions to specific plan prices.
-- See README.md for full design rationale.

CREATE TABLE subscription_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions (id) ON DELETE CASCADE,
  plan_price_id   UUID NOT NULL REFERENCES plan_prices (id) ON DELETE RESTRICT,
  quantity        INTEGER NOT NULL DEFAULT 1,
  metadata        JSONB,
  provider_type   TEXT,
  provider_id     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (subscription_id, plan_price_id)
);

CREATE INDEX idx_subscription_items_plan_price_id ON subscription_items (plan_price_id);
