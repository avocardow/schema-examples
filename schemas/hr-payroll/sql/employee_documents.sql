-- employee_documents: Employee-uploaded documents with type classification and expiry tracking.
-- See README.md for full design rationale.

CREATE TYPE document_type AS ENUM (
  'contract', 'tax_form', 'identification', 'certification',
  'offer_letter', 'performance_review', 'other'
);

CREATE TYPE document_status AS ENUM (
  'active', 'expired', 'superseded', 'archived'
);

CREATE TABLE employee_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id     UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  file_id         UUID NOT NULL REFERENCES files (id) ON DELETE CASCADE,
  type            document_type NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  issued_date     TEXT,
  expiry_date     TEXT,
  status          document_status NOT NULL DEFAULT 'active',
  uploaded_by     UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employee_documents_employee_id ON employee_documents (employee_id);
CREATE INDEX idx_employee_documents_file_id ON employee_documents (file_id);
CREATE INDEX idx_employee_documents_type ON employee_documents (type);
CREATE INDEX idx_employee_documents_expiry_date ON employee_documents (expiry_date);
CREATE INDEX idx_employee_documents_status ON employee_documents (status);
