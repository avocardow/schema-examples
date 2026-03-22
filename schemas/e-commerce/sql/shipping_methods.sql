-- shipping_methods: Delivery options with pricing and constraints, scoped to a shipping zone.
-- See README.md for full design rationale.

CREATE TABLE shipping_methods (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id           UUID NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
    profile_id        UUID REFERENCES shipping_profiles(id) ON DELETE SET NULL,
    name              TEXT NOT NULL,
    description       TEXT,
    price             INTEGER NOT NULL,
    currency          TEXT NOT NULL,
    min_delivery_days INTEGER,
    max_delivery_days INTEGER,
    min_order_amount  INTEGER,
    max_weight_grams  INTEGER,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order        INTEGER NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipping_methods_zone_id_active_sort ON shipping_methods (zone_id, is_active, sort_order);
CREATE INDEX idx_shipping_methods_profile_id ON shipping_methods (profile_id);
