-- subscriptions: Customer subscription lifecycle with period and trial tracking.
-- See README.md for full design rationale.

CREATE TYPE subscription_status AS ENUM (
  'trialing', 'active', 'past_due', 'paused', 'canceled', 'expired', 'incomplete'
);

CREATE TABLE subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id          UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  status               subscription_status NOT NULL DEFAULT 'incomplete',
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  trial_start          TIMESTAMPTZ,
  trial_end            TIMESTAMPTZ,
  canceled_at          TIMESTAMPTZ,
  ended_at             TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  paused_at            TIMESTAMPTZ,
  resumes_at           TIMESTAMPTZ,
  billing_cycle_anchor TIMESTAMPTZ,
  coupon_id            UUID REFERENCES coupons (id) ON DELETE SET NULL,
  metadata             JSONB,
  provider_type        TEXT,
  provider_id          TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_customer_id ON subscriptions (customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions (status);
CREATE INDEX idx_subscriptions_provider ON subscriptions (provider_type, provider_id);
