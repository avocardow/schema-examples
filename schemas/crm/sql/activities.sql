-- activities: Logged interactions (calls, emails, meetings) tied to contacts, companies, or deals.
-- See README.md for full design rationale.

CREATE TYPE activity_type AS ENUM ('call', 'email', 'meeting');

CREATE TABLE activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        activity_type NOT NULL,
  subject     TEXT NOT NULL,
  description TEXT,
  occurred_at TIMESTAMPTZ NOT NULL,
  duration    INTEGER,
  contact_id  UUID,
  company_id  UUID,
  deal_id     UUID,
  owner_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FKs: contacts, companies, and deals load after activities alphabetically.
ALTER TABLE activities
  ADD CONSTRAINT fk_activities_contact
  FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE SET NULL;

ALTER TABLE activities
  ADD CONSTRAINT fk_activities_company
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE SET NULL;

ALTER TABLE activities
  ADD CONSTRAINT fk_activities_deal
  FOREIGN KEY (deal_id) REFERENCES deals (id) ON DELETE SET NULL;

CREATE INDEX idx_activities_contact_occurred ON activities (contact_id, occurred_at);
CREATE INDEX idx_activities_company_occurred ON activities (company_id, occurred_at);
CREATE INDEX idx_activities_deal_occurred ON activities (deal_id, occurred_at);
CREATE INDEX idx_activities_owner_id ON activities (owner_id);
CREATE INDEX idx_activities_type ON activities (type);
