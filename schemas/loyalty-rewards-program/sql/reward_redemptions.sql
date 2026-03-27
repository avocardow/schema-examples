-- reward_redemptions: Records of members redeeming points for rewards with fulfillment lifecycle.
-- See README.md for full design rationale.

CREATE TYPE redemption_status AS ENUM ('pending', 'fulfilled', 'canceled', 'expired');

CREATE TABLE reward_redemptions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id     UUID NOT NULL REFERENCES loyalty_members(id) ON DELETE RESTRICT,
    reward_id     UUID NOT NULL,
    points_spent  INTEGER NOT NULL,
    status        redemption_status NOT NULL DEFAULT 'pending',
    coupon_code   TEXT,
    fulfilled_at  TIMESTAMPTZ,
    canceled_at   TIMESTAMPTZ,
    expires_at    TIMESTAMPTZ,
    metadata      JSONB,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: rewards is defined in rewards.sql (loaded after reward_redemptions.sql).
ALTER TABLE reward_redemptions ADD CONSTRAINT fk_reward_redemptions_reward_id
    FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE RESTRICT;

CREATE INDEX idx_reward_redemptions_member_id_created_at ON reward_redemptions(member_id, created_at);
CREATE INDEX idx_reward_redemptions_reward_id ON reward_redemptions(reward_id);
CREATE INDEX idx_reward_redemptions_status ON reward_redemptions(status);
