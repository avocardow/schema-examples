-- teams: Sub-groups within an organization (e.g., "Engineering", "Marketing").
-- Lighter than nested orgs — no billing, SSO, or domain verification.
-- See README.md for full design rationale and field documentation.

CREATE TABLE teams (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL,                  -- Unique within the org, not globally.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (organization_id, slug)
);

CREATE INDEX idx_teams_organization_id ON teams (organization_id);
