-- notes: Free-text notes attached to contacts, companies, deals, or leads.
-- See README.md for full design rationale.

CREATE TABLE notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content    TEXT NOT NULL,
  contact_id UUID REFERENCES contacts (id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies (id) ON DELETE CASCADE,
  deal_id    UUID REFERENCES deals (id) ON DELETE CASCADE,
  lead_id    UUID REFERENCES leads (id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_contact_id ON notes (contact_id);
CREATE INDEX idx_notes_company_id ON notes (company_id);
CREATE INDEX idx_notes_deal_id ON notes (deal_id);
CREATE INDEX idx_notes_lead_id ON notes (lead_id);
CREATE INDEX idx_notes_created_by ON notes (created_by);
