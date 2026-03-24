-- deal_contacts: Join table linking deals to contacts with a stakeholder role.
-- See README.md for full design rationale.

CREATE TYPE deal_contact_role AS ENUM (
  'decision_maker', 'champion', 'influencer', 'end_user', 'other'
);

CREATE TABLE deal_contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id    UUID NOT NULL,
  contact_id UUID NOT NULL REFERENCES contacts (id) ON DELETE CASCADE,
  role       deal_contact_role NOT NULL DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (deal_id, contact_id)
);

-- Forward FK: deals loads after deal_contacts alphabetically.
ALTER TABLE deal_contacts
  ADD CONSTRAINT fk_deal_contacts_deal
  FOREIGN KEY (deal_id) REFERENCES deals (id) ON DELETE CASCADE;

CREATE INDEX idx_deal_contacts_contact_id ON deal_contacts (contact_id);
