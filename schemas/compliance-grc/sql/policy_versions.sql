-- policy_versions: Versioned snapshots of policy content with approval workflow.
-- See README.md for full design rationale.

CREATE TYPE policy_version_status AS ENUM ('draft', 'in_review', 'approved', 'archived');

CREATE TABLE policy_versions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id      UUID NOT NULL REFERENCES policies (id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  content        TEXT,
  file_id        UUID REFERENCES files (id) ON DELETE SET NULL,
  status         policy_version_status NOT NULL DEFAULT 'draft',
  approved_by    UUID REFERENCES users (id) ON DELETE SET NULL,
  approved_at    TIMESTAMPTZ,
  effective_date TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (policy_id, version_number)
);

CREATE INDEX idx_policy_versions_status ON policy_versions (status);
CREATE INDEX idx_policy_versions_approved_by ON policy_versions (approved_by);
