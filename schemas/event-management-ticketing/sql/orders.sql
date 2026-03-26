-- orders: Ticket purchase transactions with payment and buyer details.
-- See README.md for full design rationale.

CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE order_payment_status AS ENUM ('not_required', 'pending', 'paid', 'refunded', 'partially_refunded', 'failed');

CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events (id) ON DELETE RESTRICT,
  user_id             UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  promo_code_id       UUID REFERENCES promo_codes (id) ON DELETE SET NULL,
  subtotal            INTEGER NOT NULL DEFAULT 0,
  discount_amount     INTEGER NOT NULL DEFAULT 0,
  total               INTEGER NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'USD',
  status              order_status NOT NULL DEFAULT 'pending',
  payment_status      order_payment_status NOT NULL DEFAULT 'pending',
  payment_method      TEXT,
  buyer_name          TEXT NOT NULL,
  buyer_email         TEXT NOT NULL,
  cancelled_at        TIMESTAMPTZ,
  refunded_at         TIMESTAMPTZ,
  confirmed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_event_id_status ON orders (event_id, status);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_buyer_email ON orders (buyer_email);
