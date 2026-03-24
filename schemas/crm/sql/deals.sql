-- deals: Revenue opportunities tracked through pipeline stages to close.
-- See README.md for full design rationale.

-- Shared enum: also used by tasks.sql.
CREATE TYPE deal_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE deals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  pipeline_id         UUID NOT NULL,
  stage_id            UUID,
  value               NUMERIC,
  currency            TEXT NOT NULL DEFAULT 'USD',
  expected_close_date TEXT,
  closed_at           TIMESTAMPTZ,
  lost_reason         TEXT,
  priority            deal_priority NOT NULL DEFAULT 'medium',
  owner_id            UUID REFERENCES users (id) ON DELETE SET NULL,
  company_id          UUID REFERENCES companies (id) ON DELETE SET NULL,
  contact_id          UUID REFERENCES contacts (id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FKs: pipelines and pipeline_stages load after deals alphabetically.
ALTER TABLE deals
  ADD CONSTRAINT fk_deals_pipeline
  FOREIGN KEY (pipeline_id) REFERENCES pipelines (id) ON DELETE RESTRICT;

ALTER TABLE deals
  ADD CONSTRAINT fk_deals_stage
  FOREIGN KEY (stage_id) REFERENCES pipeline_stages (id) ON DELETE SET NULL;

CREATE INDEX idx_deals_pipeline_stage ON deals (pipeline_id, stage_id);
CREATE INDEX idx_deals_owner_id ON deals (owner_id);
CREATE INDEX idx_deals_company_id ON deals (company_id);
CREATE INDEX idx_deals_contact_id ON deals (contact_id);
CREATE INDEX idx_deals_expected_close_date ON deals (expected_close_date);
CREATE INDEX idx_deals_closed_at ON deals (closed_at);
