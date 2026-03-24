-- contacts: People tracked in the CRM with lifecycle stage and ownership.
-- See README.md for full design rationale.

CREATE TYPE lifecycle_stage AS ENUM (
  'subscriber', 'lead', 'qualified', 'opportunity', 'customer', 'evangelist', 'other'
);

-- Shared enum: also used by leads.sql.
CREATE TYPE lead_source AS ENUM (
  'web', 'referral', 'organic', 'paid', 'social', 'event', 'cold_outreach', 'other'
);

CREATE TABLE contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  phone           TEXT,
  title           TEXT,
  lifecycle_stage lifecycle_stage NOT NULL DEFAULT 'lead',
  source          lead_source,
  owner_id        UUID REFERENCES users (id) ON DELETE SET NULL,
  avatar_url      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_owner_id ON contacts (owner_id);
CREATE INDEX idx_contacts_lifecycle_stage ON contacts (lifecycle_stage);
