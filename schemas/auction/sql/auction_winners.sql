-- auction_winners: Records of winning bids and settlement tracking for completed auctions.
-- See README.md for full design rationale.

CREATE TYPE settlement_status AS ENUM ('pending', 'paid', 'shipped', 'completed', 'disputed', 'refunded');

CREATE TABLE auction_winners (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id          UUID UNIQUE NOT NULL REFERENCES auctions(id) ON DELETE RESTRICT,
    winning_bid_id      UUID UNIQUE NOT NULL REFERENCES bids(id) ON DELETE RESTRICT,
    winner_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    seller_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    hammer_price        INTEGER NOT NULL,
    buyer_premium       INTEGER NOT NULL DEFAULT 0,
    total_price         INTEGER NOT NULL,
    settlement_status   settlement_status NOT NULL DEFAULT 'pending',
    paid_at             TIMESTAMPTZ,
    shipped_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auction_winners_winner_id ON auction_winners(winner_id);
CREATE INDEX idx_auction_winners_seller_id ON auction_winners(seller_id);
CREATE INDEX idx_auction_winners_settlement_status ON auction_winners(settlement_status);
