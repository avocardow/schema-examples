-- leads: Inbound prospects not yet converted to contacts.
-- See README.md for full design rationale.

-- lead_source enum is defined in contacts.sql (shared).

CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'unqualified', 'converted');

CREATE TABLE leads (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name           TEXT NOT NULL,
  last_name            TEXT NOT NULL,
  email                TEXT NOT NULL UNIQUE,
  phone                TEXT,
  company_name         TEXT,
  title                TEXT,
  source               lead_source,
  status               lead_status NOT NULL DEFAULT 'new',
  converted_at         TIMESTAMPTZ,
  converted_contact_id UUID REFERENCES contacts (id) ON DELETE SET NULL,
  owner_id             UUID REFERENCES users (id) ON DELETE SET NULL,
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads (status);
CREATE INDEX idx_leads_owner_id ON leads (owner_id);
CREATE INDEX idx_leads_source ON leads (source);
