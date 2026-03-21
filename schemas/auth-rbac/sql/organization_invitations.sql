-- organization_invitations: Pending invitations to join an organization.
-- Separate from organization_members because invitations can exist before the invitee has an account.
-- See README.md for full design rationale and field documentation.

CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');

CREATE TABLE organization_invitations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email             TEXT NOT NULL,                  -- Invitee's email. They may not have an account yet.
  role_id           UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT, -- Can't delete a role with pending invitations.
  status            invitation_status NOT NULL DEFAULT 'pending',
  token_hash        TEXT UNIQUE NOT NULL,           -- Hashed invitation token. Raw token sent in invite email.
  inviter_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  expires_at        TIMESTAMPTZ NOT NULL,           -- Typically 7 days.
  accepted_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organization_invitations_org_status ON organization_invitations (organization_id, status);
CREATE INDEX idx_organization_invitations_email ON organization_invitations (email);
