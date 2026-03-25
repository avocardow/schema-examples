-- coupon_redemptions: Records of coupon usage by customers on subscriptions.
-- See README.md for full design rationale.

CREATE TABLE coupon_redemptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id       UUID NOT NULL REFERENCES coupons (id) ON DELETE CASCADE,
  customer_id     UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions (id) ON DELETE SET NULL,
  redeemed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  provider_type   TEXT,
  provider_id     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupon_redemptions_coupon_id ON coupon_redemptions (coupon_id);
CREATE INDEX idx_coupon_redemptions_customer_id ON coupon_redemptions (customer_id);
CREATE INDEX idx_coupon_redemptions_subscription_id ON coupon_redemptions (subscription_id);
