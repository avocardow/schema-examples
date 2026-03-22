-- discount_usages: Tracks each time a discount code is applied to an order.
-- See README.md for full design rationale.

CREATE TABLE discount_usages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discount_id     UUID NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
    order_id        UUID NOT NULL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: orders.sql loads after discount_usages.sql alphabetically.
ALTER TABLE discount_usages
    ADD CONSTRAINT fk_discount_usages_order_id
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

CREATE INDEX idx_discount_usages_discount_id_user_id ON discount_usages (discount_id, user_id);
CREATE UNIQUE INDEX idx_discount_usages_discount_id_order_id ON discount_usages (discount_id, order_id);
