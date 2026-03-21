-- sso_domains: Maps email domains to SSO providers for automatic login routing.
-- When @acme.com users sign in, they're routed to Acme's SSO provider.
-- Different from organization_domains (which proves domain ownership for auto-join).
-- See README.md for full design rationale and field documentation.

CREATE TABLE sso_domains (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oauth_provider_id UUID NOT NULL REFERENCES oauth_providers(id) ON DELETE CASCADE,
  domain            TEXT UNIQUE NOT NULL,           -- e.g., "acme.com". One domain = one provider.
  verified          BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sso_domains_oauth_provider_id ON sso_domains (oauth_provider_id);
