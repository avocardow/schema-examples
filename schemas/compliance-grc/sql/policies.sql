-- policies: Organizational policies, standards, procedures, and guidelines.
-- See README.md for full design rationale.

CREATE TYPE policy_type AS ENUM ('policy', 'standard', 'procedure', 'guideline');
CREATE TYPE policy_review_frequency AS ENUM ('monthly', 'quarterly', 'semi_annually', 'annually', 'biennially');

CREATE TABLE policies (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID REFERENCES organizations (id) ON DELETE CASCADE,
  owner_id         UUID REFERENCES users (id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  policy_type      policy_type NOT NULL DEFAULT 'policy',
  description      TEXT,
  review_frequency policy_review_frequency NOT NULL DEFAULT 'annually',
  next_review_date TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_policies_organization_id ON policies (organization_id);
CREATE INDEX idx_policies_owner_id ON policies (owner_id);
CREATE INDEX idx_policies_policy_type ON policies (policy_type);
CREATE INDEX idx_policies_is_active ON policies (is_active);
