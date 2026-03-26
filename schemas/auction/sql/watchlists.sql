-- watchlists: Tracks auctions a user is watching for notifications.
-- See README.md for full design rationale.

CREATE TABLE watchlists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    auction_id      UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    notify_outbid   BOOLEAN NOT NULL DEFAULT true,
    notify_ending   BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, auction_id)
);

CREATE INDEX idx_watchlists_auction_id ON watchlists(auction_id);
