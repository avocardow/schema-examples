-- contact_companies: Join table linking contacts to companies with role and primary flag.
-- See README.md for full design rationale.

CREATE TABLE contact_companies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  role       TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (contact_id, company_id)
);

-- Forward FK: contacts loads after contact_companies alphabetically.
ALTER TABLE contact_companies
  ADD CONSTRAINT fk_contact_companies_contact
  FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE CASCADE;

CREATE INDEX idx_contact_companies_company_id ON contact_companies (company_id);
