-- payment_methods: Stored payment instruments linked to a user (cards, bank accounts, wallets).
-- See README.md for full design rationale.

CREATE TYPE payment_method_type AS ENUM ('card', 'bank_account', 'paypal', 'apple_pay', 'google_pay');

CREATE TABLE payment_methods (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            payment_method_type NOT NULL,
    provider        TEXT NOT NULL,
    provider_id     TEXT NOT NULL,
    label           TEXT,
    last_four       TEXT,
    brand           TEXT,
    exp_month       INTEGER,
    exp_year        INTEGER,
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user_id ON payment_methods (user_id);
CREATE UNIQUE INDEX idx_payment_methods_provider_provider_id ON payment_methods (provider, provider_id);
