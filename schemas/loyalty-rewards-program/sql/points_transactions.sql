-- points_transactions: Immutable ledger of every point movement (earn, redeem, expire, adjust).
-- See README.md for full design rationale.

CREATE TYPE points_transaction_type AS ENUM ('earn', 'redeem', 'expire', 'adjust', 'bonus');

CREATE TABLE points_transactions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id             UUID NOT NULL REFERENCES loyalty_members(id) ON DELETE RESTRICT,
    type                  points_transaction_type NOT NULL,
    points                INTEGER NOT NULL,
    balance_after         INTEGER NOT NULL,
    description           TEXT,
    source_reference_type TEXT,
    source_reference_id   TEXT,
    earning_rule_id       UUID REFERENCES earning_rules(id) ON DELETE SET NULL,
    promotion_id          UUID,
    redemption_id         UUID,
    expires_at            TIMESTAMPTZ,
    is_pending            BOOLEAN NOT NULL DEFAULT false,
    confirmed_at          TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: promotions is defined in promotions.sql (loaded after points_transactions.sql).
ALTER TABLE points_transactions ADD CONSTRAINT fk_points_transactions_promotion_id
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL;

-- Forward FK: reward_redemptions is defined in reward_redemptions.sql (loaded after points_transactions.sql).
ALTER TABLE points_transactions ADD CONSTRAINT fk_points_transactions_redemption_id
    FOREIGN KEY (redemption_id) REFERENCES reward_redemptions(id) ON DELETE SET NULL;

CREATE INDEX idx_points_transactions_member_id_created_at ON points_transactions(member_id, created_at);
CREATE INDEX idx_points_transactions_type ON points_transactions(type);
CREATE INDEX idx_points_transactions_expires_at ON points_transactions(expires_at);
CREATE INDEX idx_points_transactions_is_pending ON points_transactions(is_pending);
CREATE INDEX idx_points_transactions_source_ref ON points_transactions(source_reference_type, source_reference_id);
