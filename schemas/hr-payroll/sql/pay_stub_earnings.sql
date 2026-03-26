-- pay_stub_earnings: Individual earning line items on a pay stub.
-- See README.md for full design rationale.

CREATE TABLE pay_stub_earnings (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    pay_stub_id     UUID        NOT NULL REFERENCES pay_stubs(id) ON DELETE CASCADE,
    earning_type_id UUID        NOT NULL REFERENCES earning_types(id) ON DELETE RESTRICT,
    hours           NUMERIC,
    rate            INTEGER,
    amount          INTEGER     NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pay_stub_earnings_pay_stub_id ON pay_stub_earnings(pay_stub_id);
CREATE INDEX idx_pay_stub_earnings_earning_type_id ON pay_stub_earnings(earning_type_id);
