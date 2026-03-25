-- invoices: Billing documents generated for subscriptions or one-time charges.
-- See README.md for full design rationale.

CREATE TYPE invoice_status AS ENUM (
  'draft', 'open', 'paid', 'void', 'uncollectible'
);

CREATE TABLE invoices (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id        UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  subscription_id    UUID REFERENCES subscriptions (id) ON DELETE SET NULL,
  status             invoice_status NOT NULL DEFAULT 'draft',
  currency           TEXT NOT NULL,
  subtotal           INTEGER NOT NULL DEFAULT 0,
  tax                INTEGER NOT NULL DEFAULT 0,
  total              INTEGER NOT NULL DEFAULT 0,
  amount_paid        INTEGER NOT NULL DEFAULT 0,
  amount_due         INTEGER NOT NULL DEFAULT 0,
  period_start       TIMESTAMPTZ,
  period_end         TIMESTAMPTZ,
  due_date           TIMESTAMPTZ,
  paid_at            TIMESTAMPTZ,
  hosted_invoice_url TEXT,
  invoice_pdf_url    TEXT,
  metadata           JSONB,
  provider_type      TEXT,
  provider_id        TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_customer_id ON invoices (customer_id);
CREATE INDEX idx_invoices_subscription_id ON invoices (subscription_id);
CREATE INDEX idx_invoices_status ON invoices (status);
CREATE INDEX idx_invoices_provider ON invoices (provider_type, provider_id);
