-- items: Auction item listings with condition tracking and seller association.
-- See README.md for full design rationale.

CREATE TYPE item_condition AS ENUM ('new', 'like_new', 'excellent', 'good', 'fair', 'poor');

CREATE TABLE items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
    title               TEXT NOT NULL,
    description         TEXT,
    condition           item_condition NOT NULL DEFAULT 'new',
    condition_notes     TEXT,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_items_seller_id ON items(seller_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_condition ON items(condition);

-- Forward FK from auctions: moved here because items.sql loads after auctions.sql alphabetically.
ALTER TABLE auctions ADD CONSTRAINT fk_auctions_item_id
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT;
