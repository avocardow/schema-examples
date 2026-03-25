-- payment_methods: Stored payment instruments for customers.
-- See README.md for full design rationale.

CREATE TYPE payment_method_type AS ENUM (
  'card', 'bank_account', 'paypal', 'sepa_debit', 'ideal', 'other'
);

CREATE TABLE payment_methods (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  type          payment_method_type NOT NULL,
  card_brand    TEXT,
  card_last4    TEXT,
  card_exp_month INTEGER,
  card_exp_year  INTEGER,
  is_default    BOOLEAN NOT NULL DEFAULT FALSE,
  provider_type TEXT,
  provider_id   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Security: card_last4 stores only the last four digits; full card data is never persisted.

CREATE INDEX idx_payment_methods_customer_id ON payment_methods (customer_id);
CREATE INDEX idx_payment_methods_provider ON payment_methods (provider_type, provider_id);
