-- auctions: Core auction listings with pricing, timing, and anti-sniping controls.
-- See README.md for full design rationale.

CREATE TYPE auction_type AS ENUM ('english', 'dutch', 'sealed_bid', 'buy_now_only');
CREATE TYPE auction_status AS ENUM ('draft', 'scheduled', 'active', 'closing', 'closed', 'cancelled');

CREATE TABLE auctions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id                  UUID NOT NULL,
  seller_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  auction_type             auction_type NOT NULL DEFAULT 'english',
  status                   auction_status NOT NULL DEFAULT 'draft',
  title                    TEXT NOT NULL,
  description              TEXT,
  starting_price           NUMERIC NOT NULL,
  reserve_price            NUMERIC,
  buy_now_price            NUMERIC,
  current_price            NUMERIC NOT NULL DEFAULT 0,
  bid_count                INTEGER NOT NULL DEFAULT 0,
  highest_bidder_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  buyer_premium_pct        NUMERIC,
  start_time               TIMESTAMPTZ,
  end_time                 TIMESTAMPTZ,
  effective_end_time       TIMESTAMPTZ,
  extension_seconds        INTEGER NOT NULL DEFAULT 300,
  extension_window_seconds INTEGER NOT NULL DEFAULT 300,
  currency                 TEXT NOT NULL DEFAULT 'USD',
  closed_at                TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auctions_item_id ON auctions (item_id);
CREATE INDEX idx_auctions_seller_id ON auctions (seller_id);
CREATE INDEX idx_auctions_status ON auctions (status);
CREATE INDEX idx_auctions_auction_type ON auctions (auction_type);
CREATE INDEX idx_auctions_effective_end_time ON auctions (effective_end_time);
