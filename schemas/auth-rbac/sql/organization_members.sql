-- organization_members: Links users to organizations with a role.
-- role_id must reference a role with scope=organization (enforced in app logic).
-- Member rows are created when an invitation is accepted (see organization_invitations).
-- See README.md for full design rationale and field documentation.

CREATE TYPE membership_status AS ENUM ('active', 'inactive');

CREATE TABLE organization_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id           UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT, -- Can't delete a role that's in use.
  status            membership_status NOT NULL DEFAULT 'active',

  -- SCIM provisioning: managed by external directory (Okta, Azure AD).
  -- Directory-managed memberships shouldn't be editable through your app's UI.
  directory_managed BOOLEAN NOT NULL DEFAULT FALSE,

  custom_attributes JSONB,                          -- Org-specific metadata (e.g., department, title within org).
  invited_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  joined_at         TIMESTAMPTZ,                    -- When invitation was accepted. May differ from created_at for SCIM members.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_organization_members_user_id ON organization_members (user_id);
CREATE INDEX idx_organization_members_org_status ON organization_members (organization_id, status);
