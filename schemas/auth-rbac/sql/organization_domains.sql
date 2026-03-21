-- organization_domains: Verified domains owned by an organization.
-- Enables auto-join: users with @acme.com are automatically added to the Acme org on signup.
-- Different from sso_domains (which routes login traffic to an SSO provider).
-- See README.md for full design rationale and field documentation.

CREATE TABLE organization_domains (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  domain              TEXT UNIQUE NOT NULL,         -- e.g., "acme.com". Lowercase, no protocol prefix.
  verified            BOOLEAN NOT NULL DEFAULT FALSE,
  verification_method TEXT,                         -- "dns" (TXT record), "email", etc.
  verification_token  TEXT,                         -- Token the org sets in DNS or confirms via email.
  verified_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organization_domains_organization_id ON organization_domains (organization_id);
