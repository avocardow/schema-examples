-- wishlist_items: Tracks individual product variants saved to a customer wishlist.
-- See README.md for full design rationale.

CREATE TABLE wishlist_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id     UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
    variant_id      UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    added_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_wishlist_items_wishlist_id_variant_id ON wishlist_items (wishlist_id, variant_id);
