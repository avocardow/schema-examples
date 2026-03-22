-- carts: Shopping carts supporting both authenticated users and anonymous sessions.
-- See README.md for full design rationale.

CREATE TABLE carts (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id           TEXT,
    currency             TEXT NOT NULL DEFAULT 'USD',
    shipping_address_id  UUID REFERENCES addresses(id) ON DELETE SET NULL,
    billing_address_id   UUID REFERENCES addresses(id) ON DELETE SET NULL,
    discount_code        TEXT,
    note                 TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_carts_user_id ON carts (user_id);
CREATE INDEX idx_carts_session_id ON carts (session_id);
