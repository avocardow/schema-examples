-- bid_increment_rules: Tiered minimum bid increments based on current price range.
-- See README.md for full design rationale.

CREATE TABLE bid_increment_rules (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id  UUID REFERENCES auctions(id) ON DELETE CASCADE,
    min_price   NUMERIC NOT NULL,
    max_price   NUMERIC,
    increment   NUMERIC NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bid_increment_rules_auction_id ON bid_increment_rules(auction_id);
CREATE INDEX idx_bid_increment_rules_min_price ON bid_increment_rules(min_price);
