-- rewards: Catalog of available rewards with points cost and inventory tracking.
-- See README.md for full design rationale.

CREATE TYPE reward_type AS ENUM ('discount_percentage', 'discount_fixed', 'free_product', 'free_shipping', 'gift_card', 'experience', 'custom');

CREATE TABLE rewards (
    id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id                 UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
    name                       TEXT NOT NULL,
    description                TEXT,
    reward_type                reward_type NOT NULL,
    points_cost                INTEGER NOT NULL,
    reward_value               INTEGER,
    currency                   TEXT,
    image_url                  TEXT,
    inventory                  INTEGER,
    max_redemptions_per_member INTEGER,
    is_active                  BOOLEAN NOT NULL DEFAULT true,
    min_tier_id                UUID,
    metadata                   JSONB,
    sort_order                 INTEGER NOT NULL DEFAULT 0,
    valid_from                 TIMESTAMPTZ,
    valid_until                TIMESTAMPTZ,
    created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: tiers is defined in tiers.sql (loaded after rewards.sql).
ALTER TABLE rewards ADD CONSTRAINT fk_rewards_min_tier_id
    FOREIGN KEY (min_tier_id) REFERENCES tiers(id) ON DELETE SET NULL;

CREATE INDEX idx_rewards_program_id_is_active ON rewards(program_id, is_active);
CREATE INDEX idx_rewards_reward_type ON rewards(reward_type);
CREATE INDEX idx_rewards_min_tier_id ON rewards(min_tier_id);
