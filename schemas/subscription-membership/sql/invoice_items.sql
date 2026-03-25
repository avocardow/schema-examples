-- invoice_items: Individual line items on an invoice with proration support.
-- See README.md for full design rationale.

CREATE TABLE invoice_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id    UUID NOT NULL REFERENCES invoices (id) ON DELETE CASCADE,
  plan_price_id UUID REFERENCES plan_prices (id) ON DELETE SET NULL,
  description   TEXT NOT NULL,
  amount        INTEGER NOT NULL,
  currency      TEXT NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1,
  is_proration  BOOLEAN NOT NULL DEFAULT FALSE,
  period_start  TIMESTAMPTZ,
  period_end    TIMESTAMPTZ,
  provider_type TEXT,
  provider_id   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items (invoice_id);
CREATE INDEX idx_invoice_items_plan_price_id ON invoice_items (plan_price_id);
