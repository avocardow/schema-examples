-- custom_domains: Custom domains mapped to tenant organizations with DNS verification and SSL tracking.
-- See README.md for full design rationale.

CREATE TYPE verification_method AS ENUM ('cname', 'txt');
CREATE TYPE ssl_status          AS ENUM ('pending', 'active', 'failed', 'expired');

CREATE TABLE custom_domains (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  domain              TEXT NOT NULL UNIQUE,
  verification_method verification_method NOT NULL DEFAULT 'cname',
  verification_token  TEXT NOT NULL,
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at         TIMESTAMPTZ,
  ssl_status          ssl_status NOT NULL DEFAULT 'pending',
  ssl_expires_at      TIMESTAMPTZ,
  is_primary          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_domains_organization_id ON custom_domains (organization_id);
