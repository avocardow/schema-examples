-- pay_stub_deductions: Individual deduction line items on each pay stub.
-- See README.md for full design rationale.

CREATE TABLE pay_stub_deductions (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    pay_stub_id       UUID        NOT NULL REFERENCES pay_stubs(id) ON DELETE CASCADE,
    deduction_type_id UUID        NOT NULL REFERENCES deduction_types(id) ON DELETE RESTRICT,
    employee_amount   INTEGER     NOT NULL DEFAULT 0,
    employer_amount   INTEGER     NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pay_stub_deductions_pay_stub_id ON pay_stub_deductions (pay_stub_id);
CREATE INDEX idx_pay_stub_deductions_deduction_type_id ON pay_stub_deductions (deduction_type_id);
