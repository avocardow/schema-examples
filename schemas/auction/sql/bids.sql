-- bids: Individual bid entries with proxy bidding and status tracking.
-- See README.md for full design rationale.

CREATE TYPE bid_status AS ENUM ('active', 'outbid', 'winning', 'won', 'cancelled');

CREATE TABLE bids (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id       UUID NOT NULL REFERENCES auctions(id) ON DELETE RESTRICT,
    bidder_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount           NUMERIC NOT NULL,
    max_amount       NUMERIC,
    status           bid_status NOT NULL DEFAULT 'active',
    is_proxy         BOOLEAN NOT NULL DEFAULT false,
    ip_address       TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_bids_auction_amount UNIQUE (auction_id, amount)
);

CREATE INDEX idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX idx_bids_status ON bids(status);
