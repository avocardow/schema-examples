-- compliance_tags: Reusable labels for categorizing compliance entities.
-- See README.md for full design rationale.

CREATE TABLE compliance_tags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations (id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  color           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (organization_id, name)
);
